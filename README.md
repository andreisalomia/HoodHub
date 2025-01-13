### Hackathon Project 2024

```
git clone https://github.com/GrecuAlexandru/gosky.git
```

```
cd gosky
```

```
npm install
```

Create `.env.local`

```
NEXT_PUBLIC_SUPABASE_URL=supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=anon-key
```

Download Docker Desktop

Install supabase CLI https://supabase.com/docs/guides/local-development/cli/getting-started?queryGroups=platform&platform=windows&queryGroups=access-method&access-method=kong#installing-the-supabase-cli

```
supabase login
```

```
supabase link --project-ref alkweoedcfsjubymmehl
```

```
supabase db pull
```

make sure supabase runs

```
supabase start
```

Run the app

```
npm run dev
```
