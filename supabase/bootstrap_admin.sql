-- Rode somente depois de criar e confirmar a conta pelo formulário do app.
-- Troque o e-mail abaixo pelo e-mail verificado do primeiro administrador.
UPDATE public.usuarios AS u
SET papel = 'ADMIN', ativo = true
WHERE u.email = lower(trim('seu-email-verificado@exemplo.com'))
  AND EXISTS (
    SELECT 1 FROM auth.users AS a
    WHERE a.id = u.auth_user_id
      AND a.email_confirmed_at IS NOT NULL
  );

-- Confirme que a conta esperada foi promovida:
SELECT id, nome, email, papel, ativo
FROM public.usuarios
WHERE email = lower(trim('seu-email-verificado@exemplo.com'));
