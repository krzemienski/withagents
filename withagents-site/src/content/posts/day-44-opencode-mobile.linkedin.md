# The tunnel config is the whole product

Four lines of JSON. One cloudflared binary. My phone talking to `opencode` running on my laptop. That was the whole "opencode-mobile" patch.

I spent three sessions trying to do more.

**Attempt one** was a native iOS client with a SwiftUI shell wrapping the opencode runtime. I got as far as the keystore before I realized I was rebuilding `claude-mobile-expo`, which already exists and is a different product in a different mode.

**Attempt two** was ngrok. $8/month to expose a process that already runs locally. The pricing sheet told me my architecture was wrong.

**Attempt three** was Tailscale. Mesh worked, but my carrier profile dropped two out of three connections during actual mobile use, which in agent work means every thought aborts mid-sentence.

Cloudflared free tier, one line pointing at the homebrew binary, survived all three scenarios I had used to kill the others. I stopped engineering.

---

Here is the entire config that makes it work, living in `~/.config/opencode-mobile/tunnel-config.json`:

```json
{
  "provider": "cloudflare",
  "mode": "free",
  "cloudflaredPath": "/opt/homebrew/bin/cloudflared"
}
```

The reason this matters is the mode-bet.

opencode is the canonical **SDK** product. You configure it in code. You invoke it from a shell. You pipe it around like any other CLI. That is what makes it good.

It is also what makes "iOS-native opencode" the wrong framing. The product is already on the laptop. What I needed was a legible boundary, not a second implementation.

So here is the rule I am extracting from the month I spent on this:

- **SDK-mode products** get a tunnel and an auth policy for mobile. Do not build a client.
- **Interactive-mode products** (rich skills, hooks, a whole environment) earn a real binary. `claude-mobile-expo` is that case.
- **Non-Interactive-mode products** (Ralph-style headless loops) get a different mobile story again — you want status readouts and kill switches, not an interaction surface.

Three products, three mobile stories, one rule: build the surface the runtime actually needs, not the surface the App Store expects.

---

What I still do not have is identity continuity across devices. Move from phone to tablet mid-session and opencode has no idea the caller changed. I have been pretending that is a feature ("the laptop is the identity") and it mostly is. Sometimes it is exactly the gap that makes me open a terminal instead of the phone, which defeats the whole point of the tunnel.

If you have solved multi-device SDK-agent identity without pulling a full IdP into the loop, I would genuinely like to know how.

---

Canonical post: https://withagents.dev/posts/day-44-opencode-mobile
