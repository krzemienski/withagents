# X Thread — Day 44: opencode on a phone

**1/9 (247)**
Four lines of JSON in a dotfile.

That was the whole "opencode-mobile" patch.

No iOS app. No fork. No rewrite. A cloudflared tunnel config sitting at `~/.config/opencode-mobile/tunnel-config.json`, pointed at the opencode CLI running on my laptop.

**2/9 (214)**
```json
{
  "provider": "cloudflare",
  "mode": "free",
  "cloudflaredPath": "/opt/homebrew/bin/cloudflared"
}
```

That is the entire API surface.

**3/9 (258)**
Three failed attempts got me there.

Native SwiftUI client: got to the keystore, realized I was rebuilding claude-mobile-expo.

ngrok: $8/mo to expose a process I already ran locally. Pricing sheet told me the arch was wrong.

Tailscale: mesh worked, my carrier profile didn't.

**4/9 (235)**
Cloudflared free tier survived all three scenarios that killed the others.

I stopped engineering.

**5/9 (279)**
The lesson: in SDK-mode products, "mobile version" is almost always the wrong framing.

The product is already on the laptop. You need a legible boundary, not a second implementation.

Tunnel + auth policy, not a whole new client.

**6/9 (263)**
Three products, three mobile stories:

SDK-mode (opencode) → tunnel + auth. Don't build a client.

Interactive-mode (claude-mobile-expo) → earns a real binary.

Non-Interactive-mode (Ralph headless loops) → status + kill switch, not interaction.

**7/9 (221)**
One rule:

Build the surface the runtime actually needs, not the surface the App Store expects.

**8/9 (249)**
What I still don't have: identity continuity across devices.

Move phone → tablet mid-session and opencode sees one origin. The session is the same but there's no identity handoff.

If you've solved this without a full IdP, I'd like to know how.

**9/9 (174)**
Full writeup — four lines of JSON, three failed attempts, and where the SDK mode-bet ends:

https://withagents.dev/posts/day-44-opencode-mobile
