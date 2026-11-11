# Лист для входу через пошту

`sign-in.html` — один шаблон для входу і реєстрації: у листі є код і кнопка.
Кнопка веде на `/api/auth/confirm`, який перевіряє токен на сервері, тому вона працює
в будь-якому браузері й на будь-якому пристрої. Код вводиться на сторінці входу.

## Що налаштувати в Supabase (один раз)

1. **Authentication → Emails → Templates**
   - **Magic Link**: тема `Вхід у Studytracker`, тіло — увесь вміст `sign-in.html`.
   - **Confirm signup**: та сама тема й той самий `sign-in.html` (перший вхід нової пошти приходить цим листом).
2. **Authentication → URL Configuration**
   - **Site URL**: адреса сайту, напр. `https://studytracker.xyz` (з неї в листі береться логотип і посилання в підвалі).
   - **Redirect URLs**: додати `https://studytracker.xyz/api/auth/confirm**` і для розробки `http://localhost:3000/api/auth/confirm**`.
     Без цього Supabase підставить Site URL замість адреси підтвердження, і кнопка в листі не спрацює (код працюватиме).
3. **Authentication → Providers → Email**: увімкнено; **Email OTP Length** — 6 (форма приймає 6–10 цифр), **Email OTP Expiration** — напр. 3600 с.
4. **Authentication → SMTP Settings**: вбудована пошта Supabase надсилає лише кілька листів на годину і годиться тільки для тестів.
   Для релізу — свій SMTP, напр. Resend (ключ уже є в бекенді):
   host `smtp.resend.com`, port `465`, user `resend`, password — Resend API key,
   відправник — адреса на підтвердженому в Resend домені (напр. `noreply@studytracker.xyz`).
