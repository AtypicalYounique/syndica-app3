import { useMemo, useState } from "react";
import "./styles.css";
import { BRAND } from "./brand";

// Question schema: { id, topic, level, q, options[], answer (idx), explain }
// Topics: company-fun-facts, company-products, industry
// Length parity 0.90-1.10 STRICT across options.

const BANK = [
  // BEGINNER (12) - 5 fun fact, 5 product line, 2 industry
  { id:"b1", topic:"company-fun-facts", level:"beginner",
    q:"Who are the co-founders of Syndica?",
    options:[
      "Brothers Ahmad Abbasi and Danial Abbasi, who launched the company in 2021",
      "Anatoly Yakovenko and Raj Gokal, the same duo behind the Solana Labs team",
      "Joe McCann and Mert Mumtaz, a pair of well-known Solana ecosystem voices",
      "Lucas Bruder and Buffalu, the Jito Labs team behind the Jito-Solana client",
    ],
    answer:0,
    explain:"Per the November 2021 Seed press release on PRNewswire, Syndica was co-founded by brothers Ahmad Abbasi (CEO) and Danial Abbasi (Head of Research)." },
  { id:"b2", topic:"company-fun-facts", level:"beginner",
    q:"In which U.S. city is Syndica headquartered?",
    options:[
      "Houston, Texas, the city named in its 2021 Seed round PRNewswire dateline",
      "San Francisco, California, the default home for most Web3 infra startups",
      "New York, New York, where most of the company's enterprise sales are run",
      "Miami, Florida, the city Syndica picked after its Series A funding round",
    ],
    answer:0,
    explain:"Syndica's PRNewswire Seed announcement is dated HOUSTON, and company directories list 2700 Post Oak Blvd, Houston as the registered office." },
  { id:"b3", topic:"company-fun-facts", level:"beginner",
    q:"What tagline does Syndica use to describe its long-term mission?",
    options:[
      "The Cloud of Web 3.0, repeated by founders in the Seed press release",
      "The Solana Operating System, repeated across the Sig launch blog post",
      "Infrastructure for the Decentralized Internet, used on the home page",
      "The Backbone of Web3, the official slogan in Syndica's marketing kit",
    ],
    answer:0,
    explain:"Both the Seed press release and Danial Abbasi's quote frame Syndica's ambition as building 'the Cloud of Web 3.0' for the Solana ecosystem." },
  { id:"b4", topic:"company-fun-facts", level:"beginner",
    q:"In what year did Syndica close its Seed funding round?",
    options:[
      "2021, when an $8M Seed round was announced via PRNewswire that November",
      "2019, two years before the Solana mainnet beta-mainnet transition closed",
      "2023, around the time Syndica first introduced Sig at Solana Breakpoint",
      "2024, alongside the broader wave of Solana validator client diversity",
    ],
    answer:0,
    explain:"Syndica announced its $8M Seed on November 3, 2021, co-led by Social Capital, Jump Capital, and Kindred Ventures." },
  { id:"b5", topic:"company-fun-facts", level:"beginner",
    q:"What programming language did Syndica choose to write the Sig client in?",
    options:[
      "Zig, a low-level systems language with no garbage collector and C interop",
      "Rust, the same language used by the original Solana Labs validator client",
      "Go, the language behind Jump Crypto's Radiance archival Solana client now",
      "C++, the dominant language for high-throughput trading exchange systems",
    ],
    answer:0,
    explain:"Sig is written in Zig, chosen for precise memory control with no garbage collector, C interop, and ergonomic compile-time meta-programming." },
  { id:"b6", topic:"company-products", level:"beginner",
    q:"What is Syndica's flagship cloud product for Solana developers?",
    options:[
      "Solana RPC infrastructure with HTTP and WebSocket endpoints plus APIs",
      "A custodial wallet service for Solana retail traders and stake holders",
      "An NFT marketplace built on top of the Metaplex Token Metadata Standard",
      "A launchpad for new Solana SPL tokens with vesting schedules built-in",
    ],
    answer:0,
    explain:"The syndica.io home page leads with 'Solana RPC. Custom APIs.' as the core product, served from solana-mainnet.api.syndica.io endpoints." },
  { id:"b7", topic:"company-products", level:"beginner",
    q:"What does Syndica's ChainStream API do at a high level?",
    options:[
      "Streams real-time Solana account, slot, and transaction data over WebSocket",
      "Streams Twitter mentions of a token into a Solana on-chain program log here",
      "Generates new Solana keypairs and manages custodial signing for the wallets",
      "Submits sandwich-resistant transaction bundles to Solana validators per slot",
    ],
    answer:0,
    explain:"ChainStream is Syndica's enterprise data streaming product. Clients open WebSocket subscriptions to receive Solana state and event deltas in real time." },
  { id:"b8", topic:"company-products", level:"beginner",
    q:"What is Sig in the Syndica product lineup?",
    options:[
      "An open-source Solana validator client written from scratch in the Zig",
      "A staking dashboard for tracking validator performance and APY trends",
      "A new Solana SDK that replaces the @solana/web3.js JavaScript client",
      "A trading bot framework that runs on top of any Solana RPC endpoint",
    ],
    answer:0,
    explain:"Sig is Syndica's open-source Solana validator client, written in Zig, focused on read performance and a clean codebase. The repo is github.com/Syndica/sig." },
  { id:"b9", topic:"company-products", level:"beginner",
    q:"Which Solana networks does Syndica RPC serve out of the box?",
    options:[
      "Solana Mainnet and Devnet, both reachable with the same Syndica API key",
      "Solana Mainnet only, with no Devnet support offered for any quick testing",
      "Solana Mainnet, Testnet, and Devnet, each with its own separate API keys",
      "Solana plus Ethereum mainnet, with optional cross-chain query capability",
    ],
    answer:0,
    explain:"Syndica's docs list mainnet and devnet endpoints, both authenticated with the same API key (per the docs.syndica.io RPC overview page)." },
  { id:"b10", topic:"company-products", level:"beginner",
    q:"What commission does Syndica's own Solana staking validator charge?",
    options:[
      "Zero percent commission, with the validator running the Jito-Solana client",
      "Five percent commission, the typical median rate among Solana validators",
      "Ten percent commission, set by the Solana Foundation as a default value",
      "Variable commission, adjusted each epoch based on inflation rate changes",
    ],
    answer:0,
    explain:"Per docs.syndica.io, Syndica operates a 0% commission Solana validator using the Jito-Solana client, presented alongside the Stake With Us page." },
  { id:"b11", topic:"industry", level:"beginner",
    q:"What is JSON-RPC, the protocol behind most blockchain RPC endpoints?",
    options:[
      "A remote procedure call protocol that uses JSON to encode requests and replies",
      "A binary format used for storing block data on a validator's local disk system",
      "A subset of GraphQL designed for blockchain queries with strict schema typing",
      "A REST-only specification for HTTP endpoints with no method name in the body",
    ],
    answer:0,
    explain:"JSON-RPC is a remote procedure call protocol encoded in JSON. Solana RPC implements JSON-RPC 2.0, with requests carrying a method name and parameters." },
  { id:"b12", topic:"industry", level:"beginner",
    q:"What is a Solana slot in the Solana consensus model?",
    options:[
      "A fixed time window of about 400 milliseconds in which a leader can produce",
      "A delegation slot in the staking program where validators are queued in turn",
      "A position in a memo string used to encode account ordering offsets per call",
      "A namespace inside a token mint where individual NFTs are minted in batches",
    ],
    answer:0,
    explain:"A Solana slot is a roughly 400ms time window assigned to a leader. Slots are the unit of Solana time, and blocks are produced inside slots." },

  // INTERMEDIATE (12) - 5 fun fact, 5 product line, 2 industry
  { id:"i1", topic:"company-fun-facts", level:"intermediate",
    q:"Who co-led Syndica's $8M Seed round in November 2021?",
    options:[
      "Social Capital, Jump Capital, and Kindred Ventures, all named on the wire",
      "Andreessen Horowitz, Paradigm, and Multicoin, the usual Solana investors",
      "Sequoia Capital, Lightspeed, and Coinbase Ventures, named in a TechCrunch",
      "Tiger Global, Insight, and Founders Fund, leading a follow-on Series A round",
    ],
    answer:0,
    explain:"Per the PRNewswire Seed announcement, Social Capital, Jump Capital, and Kindred Ventures were the three named co-leads of Syndica's $8M Seed round." },
  { id:"i2", topic:"company-fun-facts", level:"intermediate",
    q:"Where did Syndica publicly introduce the Sig validator client?",
    options:[
      "At Solana Breakpoint 2023, framed as a reads-optimized validator client",
      "At Solana Hacker House New York, alongside the launch of the Geyser plugin",
      "At Devcon Bogota, sharing a stage with the Ethereum client diversity panel",
      "At Consensus Austin, in a panel about Web3 cloud infrastructure providers",
    ],
    answer:0,
    explain:"Syndica's Sig page references the Breakpoint 2023 talk titled 'Introducing Sig, a Reads-Optimized Validator Client, and our progress on Gossip.'" },
  { id:"i3", topic:"company-fun-facts", level:"intermediate",
    q:"How much total venture funding has Syndica publicly disclosed raising?",
    options:[
      "Around $8 million across one Seed round announced in November 2021 alone",
      "Around $50 million across a Seed and a follow-on Series A growth round",
      "Around $100 million across multiple Solana-focused infrastructure rounds",
      "Around $25 million from a single strategic round with Solana Foundation",
    ],
    answer:0,
    explain:"Per CB Insights and the PRNewswire announcement, Syndica's only publicly disclosed round is the $8M Seed from November 3, 2021." },
  { id:"i4", topic:"company-fun-facts", level:"intermediate",
    q:"What read-to-write ratio motivated Syndica's design choices for Sig?",
    options:[
      "About 25 read calls for every sendTransaction write call on Solana RPC",
      "About 5 read calls for every sendTransaction write call on Solana RPC",
      "About 1 read call for every sendTransaction write call on Solana RPC",
      "About 100 read calls for every sendTransaction write call on Solana RPC",
    ],
    answer:0,
    explain:"In Syndica's Sig launch post, internal data over 2+ years showed roughly 25 read calls per sendTransaction, with reads representing 96.1% of node calls." },
  { id:"i5", topic:"company-fun-facts", level:"intermediate",
    q:"Which team maintains Agave, the main Rust-based Solana validator client?",
    options:[
      "Anza, the development team that spun out of Solana Labs to lead Agave now",
      "Jito Labs, the same team that ships the Jito-Solana fork with MEV tipping",
      "Jump Crypto, which also maintains the Firedancer client written entirely in C",
      "Solana Foundation, the nonprofit body funding the broader Solana ecosystem",
    ],
    answer:0,
    explain:"Per Syndica's own validator-client explainer post, Anza was forked off Solana Labs and now maintains Agave independently of the Foundation." },
  { id:"i6", topic:"company-products", level:"intermediate",
    q:"Which transport does ChainStream use to deliver subscriptions to clients?",
    options:[
      "WebSocket connections, with reconnection handling for production workloads",
      "Server-sent events delivered over plain HTTP/1.1 with no multiplexing layer",
      "GraphQL subscriptions over HTTP/3 with QUIC transport for stream traffic only",
      "Polling-based long-lived HTTP connections that simulate streaming traffic in",
    ],
    answer:0,
    explain:"Syndica's ChainStream blog post and docs both describe a WebSocket-based subscription model, with the dedicated wss endpoint chainstream.syndica.io." },
  { id:"i7", topic:"company-products", level:"intermediate",
    q:"Which regions does Syndica's Solana RPC infrastructure run in?",
    options:[
      "us-east-1, us-west-2, eu-west-2, and ap-southeast-1, with auto routing now",
      "us-east-1 and eu-west-1 only, with no Asia or Pacific presence at this time",
      "Three Asia regions only, since Solana traffic is concentrated in that area",
      "A single global region behind Cloudflare, with no per-region routing in use",
    ],
    answer:0,
    explain:"Per docs.syndica.io, Syndica RPC runs in us-east-1 (Northern Virginia), us-west-2 (Oregon), eu-west-2 (London), and ap-southeast-1 (Singapore)." },
  { id:"i8", topic:"company-products", level:"intermediate",
    q:"How can clients pass an API key when calling Syndica RPC endpoints?",
    options:[
      "URL path embedded as /api-key/KEY, or in the X-Syndica-Api-Key HTTP header",
      "Only as an OAuth bearer token in the Authorization header, not in any URL",
      "Only as a query string parameter named token, never inside any URL path",
      "Only as a signed JWT in a custom Syndica-Auth header on every RPC request",
    ],
    answer:0,
    explain:"Per the RPC docs, Syndica supports both URL-embedded auth (/api-key/KEY) and a header-based form (X-Syndica-Api-Key), valid on mainnet and devnet." },
  { id:"i9", topic:"company-products", level:"intermediate",
    q:"Which Solana subsystem did Sig tackle as its first implementation milestone?",
    options:[
      "Gossip, the peer-to-peer protocol used to share node and vote metadata first",
      "Tower BFT consensus, the voting layer that finalizes blocks across validators",
      "The Sealevel runtime, which executes Solana programs in a parallel fashion now",
      "Block production scheduling, deciding which validator is leader for a slot turn",
    ],
    answer:0,
    explain:"Syndica's Sig launch post lists Gossip (a PlumTree-style protocol with Push/Prune/Pull/Ping/Pong) as the first component built in the Zig codebase." },
  { id:"i10", topic:"company-products", level:"intermediate",
    q:"Which Solana validator client does Syndica's own staking validator run?",
    options:[
      "Jito-Solana, the MEV-aware fork of Agave used for the 0% commission node",
      "Sig, eat-your-own-dogfood style, since Syndica is the team building Sig",
      "Vanilla Agave from Anza, with no MEV layer and no Jito-Solana modifications",
      "Firedancer from Jump Crypto, since Jump also co-led the Syndica Seed round",
    ],
    answer:0,
    explain:"Per docs.syndica.io, Syndica's staking validator runs Jito-Solana at 0% commission. Sig is still in active development as a standalone codebase." },
  { id:"i11", topic:"industry", level:"intermediate",
    q:"What does MEV refer to in the Solana and broader blockchain context?",
    options:[
      "Maximal extractable value, the profit a producer can capture from block ordering",
      "Median execution voltage, a chain metric tracking validator hardware utilization",
      "Mempool exit velocity, the rate at which transactions leave the mempool per slot",
      "Maximum encrypted volume, a privacy metric tied to confidential transaction count",
    ],
    answer:0,
    explain:"MEV is maximal extractable value, the profit a block producer can capture by including, excluding, or reordering transactions inside a block." },
  { id:"i12", topic:"industry", level:"intermediate",
    q:"What does Solana's Geyser plugin model expose to streaming infrastructure?",
    options:[
      "Account, slot, and transaction data streamed out of the validator process now",
      "A way for clients to write extra signatures into the consensus voting pipeline",
      "An API for validators to vote on data availability for non-Solana data layers",
      "A monitoring sidecar exporting Prometheus metrics from the validator process",
    ],
    answer:0,
    explain:"Geyser is Solana's plugin interface for streaming account, slot, and transaction data out of the validator. ChainStream and Yellowstone build on it." },

  // EXPERT (12) - 4 fun fact, 4 product line, 4 industry
  { id:"e1", topic:"company-fun-facts", level:"expert",
    q:"Under what open-source license is the Sig validator client published?",
    options:[
      "Apache License 2.0, listed on the syndica.io/sig page and the GitHub repo too",
      "GPLv3, since most independent Ethereum and Solana clients chose copyleft now",
      "BUSL 1.1 with a four-year delay, the same model used by Uniswap v3 contracts",
      "MIT License, the lightweight permissive license most Solana programs prefer to",
    ],
    answer:0,
    explain:"The Sig page on syndica.io and the github.com/Syndica/sig repo both list the Apache License 2.0, with around 25 contributors and 1k+ stars." },
  { id:"e2", topic:"company-fun-facts", level:"expert",
    q:"What did Syndica's Sig Engineering Part 6 blog post focus on?",
    options:[
      "Progress on the Sig SVM, the Solana Virtual Machine layer of the Sig client",
      "Progress on a brand-new Sig fork written in Rust to align with Anza's Agave",
      "A migration of Sig away from the Zig language toward C++ for hot path code",
      "A pivot of Sig into an EVM-compatible client to support a Solana sidechain",
    ],
    answer:0,
    explain:"Sig Engineering Part 6, dated April 11, 2025 on syndica.io/sig, is titled 'Progress on the Sig SVM,' covering the Solana Virtual Machine in Sig." },
  { id:"e3", topic:"company-fun-facts", level:"expert",
    q:"What recurring research output does Syndica publish for the Solana ecosystem?",
    options:[
      "Monthly Deep Dive reports on Solana onchain activity, DeFi, devs, stablecoins",
      "A weekly Solana newsletter focused only on validator client release notes here",
      "Quarterly hedge-fund-only reports gated behind a paid subscription paywall now",
      "An annual State of Solana keynote, delivered live at the Solana Breakpoint event",
    ],
    answer:0,
    explain:"blog.syndica.io publishes monthly Deep Dives such as 'Deep Dive: Solana Onchain Activity January 2026' and 'Insights: Layer 1 and 2 Chains.'" },
  { id:"e4", topic:"company-fun-facts", level:"expert",
    q:"What roles do Ahmad Abbasi and Danial Abbasi hold at Syndica?",
    options:[
      "Ahmad is co-founder and CEO; Danial is co-founder and Head of Research at Syndica",
      "Ahmad is CTO and Danial is COO; both reportedly joined in late 2022 as principals",
      "Ahmad is Head of Research and Danial is the CFO; both were originally at Solana Labs",
      "Ahmad is the CMO and Danial is the CTO; both came from a prior Web2 cloud startup",
    ],
    answer:0,
    explain:"The PRNewswire seed announcement cites Ahmad Abbasi as CEO and Prospeo lists Danial Abbasi as Co-Founder, Head of Research." },
  { id:"e5", topic:"company-products", level:"expert",
    q:"How does ChainStream improve reliability over a single Solana validator stream?",
    options:[
      "Aggregates feeds from multiple validators, deduplicates, and backfills any gaps",
      "Routes every subscription through a single primary node with automatic restart now",
      "Trusts the first validator response and discards later updates for the same event",
      "Mirrors writes back into the validator pool to confirm event delivery on the next",
    ],
    answer:0,
    explain:"docs.syndica.io describes a 'fastest wins' design: ChainStream consolidates updates from multiple validators, deduplicates, and backfills missed data." },
  { id:"e6", topic:"company-products", level:"expert",
    q:"Which dimensions can ChainStream filter on server-side before pushing to clients?",
    options:[
      "Account keys with all/any/none predicates, owner program IDs, and data slices",
      "Only the originating validator IP address and the geographic region of origin",
      "Only block height and slot number ranges, with no account-level filter logic",
      "Only transaction signatures matching a hash prefix supplied by the subscriber",
    ],
    answer:0,
    explain:"The ChainStream blog post highlights flexible server-side filters: account-key all/any/none predicates, plus filtering on owner programs and data slices." },
  { id:"e7", topic:"company-products", level:"expert",
    q:"Which notification types does ChainStream currently support for subscriptions?",
    options:[
      "Transaction notifications and slot notifications, with block notifications coming",
      "Only transaction notifications, with no slot or block-level subscriptions offered",
      "Mempool sandwich attempts and validator vote credit-change deltas as the focus",
      "NFT mint events and SPL token transfer notifications only, with nothing else now",
    ],
    answer:0,
    explain:"The Solana Data Streaming blog post lists transaction notifications and slot notifications as live, with block notifications labeled coming soon." },
  { id:"e8", topic:"company-products", level:"expert",
    q:"What domain hosts the dedicated WebSocket endpoint for the ChainStream service?",
    options:[
      "wss://solana-mainnet.chainstream.syndica.io, separate from the main RPC URL now",
      "wss://solana-mainnet.api.syndica.io, the very same host as the standard RPC URL",
      "wss://chainstream.solana.com, hosted by the Solana Foundation as an extra option",
      "wss://stream.syndica.cloud, a legacy domain redirected from the original beta URL",
    ],
    answer:0,
    explain:"docs.syndica.io routes ChainStream to a separate endpoint, wss://solana-mainnet.chainstream.syndica.io/api-key/..., distinct from the main RPC URL." },
  { id:"e9", topic:"industry", level:"expert",
    q:"Why is getProgramAccounts considered the worst-case read on Solana RPC?",
    options:[
      "It scans every account owned by a program and returns matching state in full now",
      "It scans the validator's vote pool and returns vote credit signatures all at once",
      "It returns one account by public key but with all of its history records attached",
      "It computes the next leader schedule and returns the schedule as a JSON document",
    ],
    answer:0,
    explain:"getProgramAccounts iterates every account owned by a program (potentially millions). Without filters and indexes, it can be O(N) over program state." },
  { id:"e10", topic:"industry", level:"expert",
    q:"How does the finalized commitment level on Solana differ from confirmed?",
    options:[
      "Finalized requires a checkpoint vote that prevents the block from reverting later",
      "Finalized is set by the leader at production, before any vote is cast across the net",
      "Finalized only applies to vote transactions, never to user transactions across nodes",
      "Finalized and confirmed are exact synonyms in the current Solana protocol versions",
    ],
    answer:0,
    explain:"Per the Solana RPC commitment model, finalized requires a checkpoint vote and cannot revert under normal protocol assumptions; confirmed is supermajority only." },
  { id:"e11", topic:"industry", level:"expert",
    q:"Roughly how long is one Solana slot in the current protocol design?",
    options:[
      "About 400 milliseconds, the target leader window in current Solana mainnet now",
      "About 12 seconds, matching the post-Merge Ethereum mainnet block time at most",
      "About 2 seconds, matching the Cosmos Hub Tendermint block production target now",
      "About 50 milliseconds, the figure quoted as the Firedancer benchmark target one",
    ],
    answer:0,
    explain:"Solana's slot target is roughly 400 milliseconds. Syndica's Sig launch post explicitly contrasts Solana's 400ms slots with Ethereum's 12-second slots." },
  { id:"e12", topic:"industry", level:"expert",
    q:"What is the current Solana validator client diversity story on mainnet?",
    options:[
      "Three clients in flight: Agave in Rust, Firedancer in C, and Sig in Zig as well",
      "Two clients in flight: Agave and Firedancer, with Sig still in alpha pre-mainnet",
      "Five clients including Bahamut and Stratos alongside Agave, Firedancer, and Sig",
      "One client: Agave only, with Sig as a fork waiting to be merged upstream as one",
    ],
    answer:0,
    explain:"Solana's client diversity story is Agave (Rust, Anza), Firedancer (C, Jump Crypto), and Sig (Zig, Syndica). Jito-Solana is an Agave-derived fork." },
];

const TOPIC_LABEL: Record<string, string> = {
  "company-fun-facts": "Company fun facts",
  "company-products": "Syndica product line",
  "industry": "Industry and Solana",
};

const LEVEL_LABEL: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  expert: "Expert",
};

function shuffleQuestions<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function App() {
  const [length, setLength] = useState<10 | 20 | 30>(10);
  const [level, setLevel] = useState<"beginner" | "intermediate" | "expert" | "all">("all");
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<number[]>([]);
  const [done, setDone] = useState(false);

  const session = useMemo(() => {
    if (!started) return [] as typeof BANK;
    let pool = level === "all" ? BANK : BANK.filter((q) => q.level === level);
    pool = shuffleQuestions(pool);
    return pool.slice(0, Math.min(length, pool.length));
  }, [started, length, level]);

  const correctCount = picked.reduce((acc, p, i) => (p === session[i]?.answer ? acc + 1 : acc), 0);

  function start() {
    setPicked([]);
    setStep(0);
    setDone(false);
    setStarted(true);
  }

  function answer(idx: number) {
    const next = [...picked, idx];
    setPicked(next);
    if (step + 1 < session.length) {
      setStep(step + 1);
    } else {
      setDone(true);
    }
  }

  function reset() {
    setStarted(false);
    setStep(0);
    setPicked([]);
    setDone(false);
  }

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <span className="logo" dangerouslySetInnerHTML={{ __html: BRAND.logoSvg }} />
        </div>
        <a className="homelink" href={BRAND.homepage} target="_blank" rel="noreferrer">
          {BRAND.homepage.replace("https://", "")}
        </a>
      </header>

      <main className="container">
        {!started && (
          <section className="intro">
            <p className="eyebrow">For Solana builders · 36 question bank</p>
            <h1>Syndica Platform & Solana Scaling Quiz</h1>
            <p className="lede">
              Test your knowledge of Syndica the company (founders Ahmad and Danial Abbasi, Houston HQ, $8M Seed),
              the Syndica product line (Solana RPC, ChainStream WebSocket streaming, the Sig validator client written in Zig),
              and the broader Solana industry context (validator clients, slots, MEV, commitment levels).
            </p>

            <div className="card">
              <h3>Length</h3>
              <div className="pills">
                {[10, 20, 30].map((n) => (
                  <label key={n} className={"pill " + (length === n ? "selected" : "")}>
                    <input type="radio" name="len" checked={length === n} onChange={() => setLength(n as 10 | 20 | 30)} />
                    <span>{n} questions</span>
                  </label>
                ))}
              </div>
              <h3 style={{ marginTop: "1.25rem" }}>Difficulty</h3>
              <div className="pills">
                {(["all", "beginner", "intermediate", "expert"] as const).map((l) => (
                  <label key={l} className={"pill " + (level === l ? "selected" : "")}>
                    <input type="radio" name="lv" checked={level === l} onChange={() => setLevel(l)} />
                    <span>{l === "all" ? "Mixed" : LEVEL_LABEL[l]}</span>
                  </label>
                ))}
              </div>
              <div className="cta-row">
                <button className="btn primary" onClick={start}>
                  Start quiz
                </button>
                <span className="muted">Questions are randomized each run.</span>
              </div>
            </div>
          </section>
        )}

        {started && !done && session.length > 0 && (
          <section className="quiz">
            <p className="eyebrow">
              Question {step + 1} of {session.length} · {TOPIC_LABEL[session[step].topic]} · {LEVEL_LABEL[session[step].level]}
            </p>
            <h2 className="qhead">{session[step].q}</h2>
            <div className="opts">
              {session[step].options.map((opt, i) => (
                <button key={i} className="opt" onClick={() => answer(i)}>
                  <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
                  <span className="opt-text">{opt}</span>
                </button>
              ))}
            </div>
            <div className="progress">
              <div className="progress-bar" style={{ width: `${((step + 1) / session.length) * 100}%` }} />
            </div>
          </section>
        )}

        {done && (
          <section className="report">
            <p className="eyebrow">Quiz complete</p>
            <h1>
              You got {correctCount} of {session.length}
            </h1>
            <p className="lede">
              {correctCount === session.length
                ? "Perfect run. You know the Syndica Cloud, ChainStream, Sig, and Solana infrastructure landscape cold."
                : correctCount >= session.length * 0.7
                ? "Strong showing. A few details on tier limits or read pressure are worth a second pass."
                : "Solid start. Skim the Sig docs and a Deep Dive report and run the quiz again."}
            </p>

            <div className="card">
              <h3>Question by question</h3>
              <ol className="review">
                {session.map((q, i) => {
                  const ok = picked[i] === q.answer;
                  return (
                    <li key={q.id} className={ok ? "ok" : "no"}>
                      <div className="review-head">
                        <span className={"badge " + (ok ? "ok" : "no")}>{ok ? "Correct" : "Missed"}</span>
                        <span className="muted">
                          {TOPIC_LABEL[q.topic]} · {LEVEL_LABEL[q.level]}
                        </span>
                      </div>
                      <p className="qhead-sm">{q.q}</p>
                      <p>
                        <strong>Your answer:</strong> {q.options[picked[i]] ?? ","}
                      </p>
                      {!ok && (
                        <p>
                          <strong>Correct answer:</strong> {q.options[q.answer]}
                        </p>
                      )}
                      <p className="muted">{q.explain}</p>
                    </li>
                  );
                })}
              </ol>
            </div>

            <div className="cta-row no-print">
              <button className="btn primary" onClick={reset}>
                Run another quiz
              </button>
            </div>
          </section>
        )}
      </main>

      <footer className="globalfoot">
        <p className="muted">{BRAND.attribution}</p>
        <p className="muted">
          Sources: <a href="https://syndica.io/enterprise" target="_blank" rel="noreferrer">syndica.io/enterprise</a>,{" "}
          <a href="https://syndica.io/products/chainstream" target="_blank" rel="noreferrer">syndica.io/products/chainstream</a>,{" "}
          <a href="https://syndica.io/sig" target="_blank" rel="noreferrer">syndica.io/sig</a>,{" "}
          <a href="https://blog.syndica.io" target="_blank" rel="noreferrer">blog.syndica.io</a>,{" "}
          <a href="https://docs.syndica.io" target="_blank" rel="noreferrer">docs.syndica.io</a>.
        </p>
      </footer>
    </div>
  );
}
