export default function Help() {
  return (
    <div className="prose prose-invert max-w-none">
      <h2>Setup Guide</h2>
      <ol>
        <li>Create a <b>Supabase</b> project. Copy the SQL in <code>/sql/schema.sql</code> into the SQL Editor and run it.</li>
        <li>Copy <code>.env.example</code> to <code>.env.local</code> and fill in values (Supabase URL + Service Role key, Meta token + Ad Account ID, SYNC_SECRET).</li>
        <li>Run <code>npm install</code>, then <code>npm run dev</code>.</li>
        <li>Trigger a sync: <code>curl -H x-sync-secret:YOUR_SECRET http://localhost:3000/api/sync</code></li>
        <li>Deploy to Vercel and add a Cron to hit <code>/api/sync</code> daily with the secret header.</li>
      </ol>
      <p>Tip: The dashboard infers product (Go-Tone, SwimComm, FreeSwim) from the ad name. You can override by updating the <code>product</code> field in the database.</p>
    </div>
  )
}
