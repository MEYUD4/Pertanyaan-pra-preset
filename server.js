const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const { port, supabaseUrl, supabaseKey } = require("./config");
const app = express();
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.static("web")); // serve frontend

app.get("/presets", async (req, res) => {
  const { data, error } = await supabase.from("presets").select("*").order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error });
  res.json(data);
});

app.listen(process.env.PORT || port, () => console.log(`Server READY ✅`));
require("./bot");