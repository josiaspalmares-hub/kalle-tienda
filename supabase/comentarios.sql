-- Copia de la migración aplicada en el proyecto Supabase "kalle" (14-nov-2026).
-- Comentarios públicos: se leen con RLS y solo se escriben por la función comentar(),
-- que valida los datos y limita a 1 comentario por minuto y 5 por día por IP (guardada como hash).
-- Para ocultar uno: update public.comentarios set visible = false where id = ...;

create extension if not exists pgcrypto with schema extensions;

create schema if not exists privado;
revoke all on schema privado from public, anon, authenticated;

create table privado.config (
  clave text primary key,
  valor text not null
);
insert into privado.config (clave, valor) values ('sal', encode(extensions.gen_random_bytes(24), 'hex'));

create table privado.intentos (
  id bigint generated always as identity primary key,
  ip_hash text not null,
  creado timestamptz not null default now()
);
create index intentos_ip_creado on privado.intentos (ip_hash, creado);

create table public.comentarios (
  id bigint generated always as identity primary key,
  nombre text not null check (char_length(nombre) between 2 and 40),
  nota smallint not null check (nota between 1 and 5),
  texto text not null check (char_length(texto) between 5 and 280),
  visible boolean not null default true,
  creado timestamptz not null default now()
);
create index comentarios_creado on public.comentarios (creado desc);

alter table public.comentarios enable row level security;
create policy "leer comentarios visibles" on public.comentarios
  for select to anon, authenticated using (visible);
revoke insert, update, delete, truncate on public.comentarios from anon, authenticated;

create or replace function public.comentar(p_nombre text, p_nota int, p_texto text)
returns table (id bigint, nombre text, nota smallint, texto text, creado timestamptz)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_nombre text := btrim(regexp_replace(regexp_replace(coalesce(p_nombre, ''), '[[:cntrl:]]', ' ', 'g'), '\s+', ' ', 'g'));
  v_texto text := btrim(regexp_replace(regexp_replace(coalesce(p_texto, ''), '[[:cntrl:]]', ' ', 'g'), '\s+', ' ', 'g'));
  v_cabeceras json := coalesce(nullif(current_setting('request.headers', true), ''), '{}')::json;
  v_ip text;
  v_hash text;
begin
  if char_length(v_nombre) not between 2 and 40 then
    raise exception 'nombre_invalido' using errcode = '22023';
  end if;
  if char_length(v_texto) not between 5 and 280 then
    raise exception 'texto_invalido' using errcode = '22023';
  end if;
  if p_nota is null or p_nota not between 1 and 5 then
    raise exception 'nota_invalida' using errcode = '22023';
  end if;

  v_ip := btrim(split_part(coalesce(v_cabeceras ->> 'cf-connecting-ip', v_cabeceras ->> 'x-real-ip', v_cabeceras ->> 'x-forwarded-for', 'sin-ip'), ',', 1));
  v_hash := encode(extensions.digest(v_ip || (select c.valor from privado.config c where c.clave = 'sal'), 'sha256'), 'hex');

  if exists (select 1 from privado.intentos i where i.ip_hash = v_hash and i.creado > now() - interval '60 seconds') then
    raise exception 'muy_seguido' using errcode = 'P0001';
  end if;
  if (select count(*) from privado.intentos i where i.ip_hash = v_hash and i.creado > now() - interval '1 day') >= 5 then
    raise exception 'limite_diario' using errcode = 'P0001';
  end if;
  if (select count(*) from public.comentarios c where c.creado > now() - interval '1 day') >= 300 then
    raise exception 'limite_global' using errcode = 'P0001';
  end if;

  insert into privado.intentos (ip_hash) values (v_hash);
  delete from privado.intentos i where i.creado < now() - interval '2 days';

  return query
    insert into public.comentarios as c (nombre, nota, texto)
    values (v_nombre, p_nota::smallint, v_texto)
    returning c.id, c.nombre, c.nota, c.texto, c.creado;
end;
$$;

revoke execute on function public.comentar(text, int, text) from public, authenticated;
grant execute on function public.comentar(text, int, text) to anon;
