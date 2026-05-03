import { useMemo, useState } from "react";
import "./styles.css";
import { BRAND } from "./brand";

// Question schema: { id, topic, level, q, options[], answer (idx), explain }
// Topics: syndica-cloud, chainstream, sig, read-write, validator-research, solana-infra
// Length parity 0.90-1.10 STRICT across options.

const BANK = [
  // BEGINNER (12)
  { id:"b1", topic:"syndica-cloud", level:"beginner",
    q:"What is Syndica primarily known for in the Solana ecosystem?",
    options:[
      "Solana RPC infrastructure plus the open-source Sig validator client",
      "A self-custody mobile wallet aimed at retail Solana traders",
      "An NFT marketplace built on top of the Metaplex Token Standard",
      "A decentralized launchpad for new Solana token offerings",
    ],
    answer:0,
    explain:"Syndica is a Solana-centric infrastructure company building RPC, ChainStream streaming, and the Sig validator client written in Zig." },
  { id:"b2", topic:"syndica-cloud", level:"beginner",
    q:"What is the headline limit of Syndica's free Standard Lite tier?",
    options:[
      "10 million requests per month and a 100 RPS rate limit per project",
      "1 million requests per month with no rate limit and full WebSocket",
      "Unlimited requests for the first 30 days and then a paid migration",
      "100 million requests per month with no concurrent connection caps",
    ],
    answer:0,
    explain:"Standard Lite is the free Syndica Cloud tier with a 10M monthly request cap and a 100 RPS rate limit." },
  { id:"b3", topic:"chainstream", level:"beginner",
    q:"What does Syndica's ChainStream API do?",
    options:[
      "Streams real-time Solana account and transaction data over WebSockets",
      "Streams Twitter mentions of a token into a Solana program log entry",
      "Generates new Solana keypairs and manages custodial signing flows",
      "Submits sandwich-resistant transaction bundles to Solana validators",
    ],
    answer:0,
    explain:"ChainStream is Syndica's real-time data streaming product, designed to replace polling with WebSocket subscriptions for Solana state and transactions." },
  { id:"b4", topic:"sig", level:"beginner",
    q:"What is Sig in the Syndica product lineup?",
    options:[
      "An open-source Solana validator client written in the Zig language",
      "A staking dashboard for tracking validator performance and APY trends",
      "A new Solana SDK that replaces the @solana/web3.js JavaScript client",
      "A trading bot framework that runs on top of any Solana RPC endpoint",
    ],
    answer:0,
    explain:"Sig is Syndica's open-source Solana validator client written in Zig, focused on read performance and lower memory usage than Agave." },
  { id:"b5", topic:"read-write", level:"beginner",
    q:"What is the approximate read to write ratio Syndica cites for typical Solana traffic?",
    options:[
      "Roughly 25 read calls for every sendTransaction write call on Solana",
      "Roughly equal reads and writes, the chain is balanced both directions",
      "Closer to 1 read per 25 writes given Solana's high transaction rate",
      "Roughly 5 reads per write on average across all Solana applications",
    ],
    answer:0,
    explain:"Syndica's Sig design rationale is the 25 to 1 read to write ratio. Solana RPC traffic is dominated by reads like getProgramAccounts." },
  { id:"b6", topic:"validator-research", level:"beginner",
    q:"What commission does Syndica's own Solana validator charge stake delegators?",
    options:[
      "A 0% commission validator with MEV optimization enabled by default",
      "A 10% commission, the standard rate set by the Solana Foundation",
      "A variable commission that adjusts based on monthly inflation rates",
      "A flat 5% commission regardless of any vote credits earned by stake",
    ],
    answer:0,
    explain:"Syndica runs a 0% commission validator with MEV optimization, a marketing channel for the broader infrastructure business." },
  { id:"b7", topic:"solana-infra", level:"beginner",
    q:"What is a Solana slot in the Solana consensus model?",
    options:[
      "A fixed time window in which a leader can produce one block of state",
      "A delegation slot in the staking program where validators are queued",
      "A position in a memo string used to encode account ordering offsets",
      "A namespace inside a token mint where individual NFTs are minted at",
    ],
    answer:0,
    explain:"A slot is a fixed time window (about 400ms) where a chosen leader produces a block. Slots are the unit of Solana time, blocks are produced inside them." },
  { id:"b8", topic:"syndica-cloud", level:"beginner",
    q:"What is the price of Syndica Cloud's Scale tier?",
    options:[
      "$199 per month, the production tier above Standard for fixed pricing",
      "$99 per month, designed for hobbyist projects above the free tier",
      "$999 per month, the entry-level enterprise plan with a SLA contract",
      "$50 per month, billed quarterly with usage-based overage above caps",
    ],
    answer:0,
    explain:"Scale is the production-tier plan at $199 per month. HyperScale, the enterprise tier above Scale, is custom priced." },
  { id:"b9", topic:"chainstream", level:"beginner",
    q:"What kind of pressure on Solana RPC is ChainStream specifically designed to remove?",
    options:[
      "Polling getSignaturesForAddress and getProgramAccounts on a tight loop",
      "Submitting too many sendTransaction calls within a short time window",
      "Calling getRecentBlockhash from many concurrent worker processes hard",
      "Indexing every transaction signature ever produced on Solana mainnet",
    ],
    answer:0,
    explain:"ChainStream replaces high-pressure polling patterns with WebSocket subscriptions that push only deltas, cutting RPC volume by 5x to 20x in practice." },
  { id:"b10", topic:"sig", level:"beginner",
    q:"Why did Syndica choose Zig as the language for the Sig validator client?",
    options:[
      "Zig allows precise memory control without a garbage collection runtime",
      "Zig is the language preferred by the Solana Labs core engineering team",
      "Zig compiles directly to Solana bytecode without any toolchain stage",
      "Zig is required by the Solana Foundation for any new validator client",
    ],
    answer:0,
    explain:"Zig was chosen for precise memory control, no garbage collector, and ergonomics that fit a high-throughput validator's hot path." },
  { id:"b11", topic:"read-write", level:"beginner",
    q:"Which heavyweight Solana RPC method is the classic indexer pressure path?",
    options:[
      "getProgramAccounts with filters across a large account-set namespace",
      "getRecentBlockhash, called once before every signed transaction batch",
      "sendTransaction, the only write entrypoint in the JSON-RPC interface",
      "getEpochInfo, called occasionally to know current epoch and slot id",
    ],
    answer:0,
    explain:"getProgramAccounts with filters scans a program's entire account set, the heaviest read path on Solana RPC. ChainStream and Sig are designed around it." },
  { id:"b12", topic:"validator-research", level:"beginner",
    q:"What are Syndica's monthly Deep Dive reports?",
    options:[
      "Free Solana ecosystem reports across DeFi, developers, and stablecoins",
      "Paid quarterly research reports for hedge funds with portfolio access",
      "Internal company memos shared only with active enterprise customers",
      "A live webinar series hosted by the Syndica research team each Friday",
    ],
    answer:0,
    explain:"Syndica publishes free monthly Deep Dive reports on Solana developers, DeFi, onchain activity, and stablecoins, available on the Syndica blog." },

  // INTERMEDIATE (12)
  { id:"i1", topic:"syndica-cloud", level:"intermediate",
    q:"How does Syndica Cloud's tier ladder progress from free to enterprise?",
    options:[
      "Standard Lite, Standard, Scale at $199, then HyperScale custom pricing",
      "Free Trial, Pro, Business, then Enterprise with negotiated SLA tiers",
      "Hobby, Build, Production, then Custom with usage-based per-call pricing",
      "Starter, Growth, Scale, then Mainnet with a flat global flat-rate plan",
    ],
    answer:0,
    explain:"Syndica's actual ladder is Standard Lite (free, 10M cap), Standard, Scale at $199, and HyperScale (custom). Other tier names are confusable invented." },
  { id:"i2", topic:"chainstream", level:"intermediate",
    q:"What is the typical RPC volume reduction reported when polling moves to ChainStream?",
    options:[
      "Roughly 5x to 20x fewer RPC calls when polling is replaced with subs",
      "Roughly 1.2x to 1.5x, since most of the calls remain on the same paths",
      "Roughly 100x fewer calls since ChainStream caches every account state",
      "Roughly the same volume, but routed through different network paths",
    ],
    answer:0,
    explain:"Polling once per second versus a subscription that pushes only on state change typically yields a 5x to 20x volume reduction in practice." },
  { id:"i3", topic:"sig", level:"intermediate",
    q:"What is the key architectural difference between Sig and the Agave client?",
    options:[
      "Sig is read-optimized in Zig with no GC, Agave is the Rust default",
      "Sig is a fork of the Java client, Agave is the Go reference for it",
      "Sig handles only block production, Agave handles only the read paths",
      "Sig and Agave are identical clients, only the project names differ now",
    ],
    answer:0,
    explain:"Sig is Syndica's Zig-based, read-optimized validator client. Agave (formerly Solana Labs) is the Rust reference client; Firedancer is the third in C." },
  { id:"i4", topic:"read-write", level:"intermediate",
    q:"Which workload pattern most strongly indicates ChainStream candidacy?",
    options:[
      "High polling frequency on getProgramAccounts with low write transaction count",
      "High sendTransaction throughput from a market-making bot every block",
      "Deep historical block reads using getBlock for an analytics workflow",
      "Occasional getAccountInfo on a wallet's balance once per user session",
    ],
    answer:0,
    explain:"The strongest signal is heavy getProgramAccounts polling, which ChainStream subscriptions replace with state-change deltas." },
  { id:"i5", topic:"validator-research", level:"intermediate",
    q:"What does MEV optimization on Syndica's validator practically mean for delegators?",
    options:[
      "Higher rewards from MEV tips passed through to stakers, on top of vote",
      "Lower vote credits because MEV processing slows finality on the chain",
      "A separate Syndica token airdropped from the validator's MEV revenues",
      "Mandatory KYC for delegators to participate in any MEV-derived income",
    ],
    answer:0,
    explain:"MEV optimization on a Solana validator typically means tips from blockspace auctions are passed through to stakers, increasing effective yield." },
  { id:"i6", topic:"solana-infra", level:"intermediate",
    q:"What does Solana's Geyser plugin model expose to streaming infrastructure?",
    options:[
      "Account, slot, and transaction data streamed out of the validator process",
      "A way for clients to write extra signatures into the consensus pipeline",
      "An API for validators to vote on data availability for non-Solana data",
      "A monitoring sidecar exporting Prometheus metrics from the validator",
    ],
    answer:0,
    explain:"Geyser is Solana's plugin interface for streaming account, slot, and transaction data out of the validator. ChainStream and Yellowstone build on it." },
  { id:"i7", topic:"syndica-cloud", level:"intermediate",
    q:"Where does the rate-limit boundary sit on Syndica's Standard Lite free tier?",
    options:[
      "100 requests per second per project, plus the 10M monthly request cap",
      "10 requests per second per API key, plus a daily soft cap on bandwidth",
      "1000 requests per second per project with no other monthly cap at all",
      "No rate limit, the only constraint is total monthly request volume here",
    ],
    answer:0,
    explain:"Standard Lite enforces 100 RPS per project alongside the 10M monthly request cap." },
  { id:"i8", topic:"chainstream", level:"intermediate",
    q:"Which transport does ChainStream use for its subscription delivery to clients?",
    options:[
      "WebSocket subscriptions designed for production reconnection guarantees",
      "Server-sent events delivered over plain HTTP/1.1 with no multiplex layer",
      "GraphQL subscriptions over HTTP/3 with QUIC transport for stream traffic",
      "Polling-based long-lived HTTP connections that simulate streaming traffic",
    ],
    answer:0,
    explain:"ChainStream uses WebSocket subscriptions, with reconnection and filter language built for production-grade streaming." },
  { id:"i9", topic:"sig", level:"intermediate",
    q:"What broader scope did Syndica announce for Sig after its initial RPC-only release?",
    options:[
      "Adding Solana Virtual Machine and runtime, becoming a full validator now",
      "Pivoting Sig to be an EVM-compatible client for Solana sidechain support",
      "Open-sourcing Sig to The Linux Foundation as a vendor-neutral upstream",
      "Replacing Sig with a Rust rewrite that aligns with the Agave codebase",
    ],
    answer:0,
    explain:"Sig started focused on RPC and read paths, then expanded scope to include Solana Virtual Machine and runtime, evolving into a full validator." },
  { id:"i10", topic:"read-write", level:"intermediate",
    q:"How does the 25-to-1 read-write ratio change Syndica's infrastructure design?",
    options:[
      "Read performance and concurrency become the primary scaling design axis",
      "Write throughput becomes the bottleneck so capacity is sized to writes",
      "Memory usage in validators becomes irrelevant, only network throughput",
      "Storage costs dominate operational expenses, scaling with writes only",
    ],
    answer:0,
    explain:"At 25 reads per write, read performance and concurrency dominate. Sig's read-optimized design and ChainStream's streaming both follow from that." },
  { id:"i11", topic:"validator-research", level:"intermediate",
    q:"Which topics show up most frequently in Syndica's monthly Deep Dive reports?",
    options:[
      "Solana developers, DeFi activity, onchain activity, and stablecoin flows",
      "Bitcoin Lightning channels, Ethereum L2 fees, and Cosmos IBC routing",
      "NFT floor prices on OpenSea and trading volume on centralized exchanges",
      "Macro topics like the dollar index and global central bank rate changes",
    ],
    answer:0,
    explain:"Syndica's Deep Dives consistently cover Solana developers, DeFi, onchain activity, and stablecoins, with ecosystem-specific data and charts." },
  { id:"i12", topic:"solana-infra", level:"intermediate",
    q:"What does Solana commitment level confirmed mean to an RPC consumer?",
    options:[
      "The block has been voted on by a supermajority and is unlikely to revert",
      "The block has been finalized into a checkpoint and cannot ever revert",
      "The block was just produced by the leader and not voted on by anybody",
      "The block has been written to the validator's local Geyser plugin sink",
    ],
    answer:0,
    explain:"Confirmed means the block has supermajority votes; finalized adds further protection. Processed is the loosest, just-seen-by-this-validator." },

  // EXPERT (12)
  { id:"e1", topic:"syndica-cloud", level:"expert",
    q:"What concurrent connection or session model does Syndica's HyperScale enterprise tier emphasize?",
    options:[
      "Dedicated capacity with custom rate-limit envelopes and named SLA terms",
      "Shared multi-tenant capacity with first-come-first-served queue policy",
      "Per-call pricing with no rate limit and pay-as-you-go overage exclusively",
      "Free unlimited usage subsidized by Solana Foundation grant funding here",
    ],
    answer:0,
    explain:"HyperScale is Syndica's enterprise tier with dedicated capacity, custom rate envelopes, and explicit SLA terms negotiated per customer." },
  { id:"e2", topic:"chainstream", level:"expert",
    q:"How does ChainStream filter subscriptions on the server side before pushing to the client?",
    options:[
      "Server-side filter language matches account keys, owners, and data slices",
      "Client filters on every push, the server emits the entire global stream",
      "Filters live entirely inside the validator's Geyser plugin configuration",
      "Filters require a server restart to apply any new subscription criteria",
    ],
    answer:0,
    explain:"ChainStream applies server-side filters on account keys, program owners, and data slices, so only matching deltas hit the client." },
  { id:"e3", topic:"sig", level:"expert",
    q:"Where in Sig's architecture does the read-path optimization most directly show up first?",
    options:[
      "Account and program-account scans, the heaviest read paths on Solana now",
      "The transaction signature verification stage, which is a write-only path",
      "Vote credit accumulation and delegation reward calculations on each epoch",
      "Block production scheduling for the validator's leader-slot turn timing",
    ],
    answer:0,
    explain:"Sig's read-path optimization shows up first in account and program-account scans, the dominant cost in Solana RPC and the indexer pressure path." },
  { id:"e4", topic:"read-write", level:"expert",
    q:"Why is getProgramAccounts considered the worst-case read on Solana RPC infrastructure?",
    options:[
      "It scans every account owned by a program and returns matching state set",
      "It scans the validator's vote pool and returns vote credit signatures all",
      "It returns one account by public key but with all of its history records",
      "It computes the next leader schedule and returns the schedule as a JSON",
    ],
    answer:0,
    explain:"getProgramAccounts scans every account owned by a program (potentially millions). Without filters and indexes, it can be O(N) over program state." },
  { id:"e5", topic:"validator-research", level:"expert",
    q:"How does Syndica describe the relationship between its validator and broader product line?",
    options:[
      "The validator is a marketing channel and reference customer for the cloud",
      "The validator is the only product, and cloud RPC is a free side feature",
      "Syndica does not run a validator, only RPC and ChainStream services here",
      "The validator pays the cloud business out of MEV revenues each month all",
    ],
    answer:0,
    explain:"Syndica positions its validator as a marketing channel and reference customer for the broader Cloud, ChainStream, and Sig product surface." },
  { id:"e6", topic:"solana-infra", level:"expert",
    q:"How does Solana's commitment level finalized differ from confirmed in a key respect?",
    options:[
      "Finalized requires a checkpoint vote that prevents future block reversion",
      "Finalized is set by the leader at production, before any vote is cast at all",
      "Finalized only applies to vote transactions, never to user transactions ever",
      "Finalized and confirmed are exact synonyms in current Solana protocol now",
    ],
    answer:0,
    explain:"Finalized requires a checkpoint vote, after which the block cannot revert under normal protocol assumptions. Confirmed has supermajority but is weaker." },
  { id:"e7", topic:"syndica-cloud", level:"expert",
    q:"What is the practical effect of Standard Lite's 100 RPS rate limit on a typical Solana app?",
    options:[
      "Bursty user load above 100 RPS gets throttled and forces upgrade tier",
      "Total monthly volume is unaffected, only the daily-quota window is hit hard",
      "Only sendTransaction calls are limited, all read calls remain uncapped now",
      "The cap applies once per public IP, not per project, so it scales linearly",
    ],
    answer:0,
    explain:"100 RPS per project on Standard Lite means bursty user load above that gets throttled, forcing upgrade to Scale or HyperScale at production scale." },
  { id:"e8", topic:"chainstream", level:"expert",
    q:"Which Solana RPC pattern does ChainStream effectively replace at production scale?",
    options:[
      "Polling getSignaturesForAddress and getProgramAccounts in a tight loop now",
      "Calling sendTransaction once per user-initiated wallet signing operation",
      "Reading getRecentBlockhash before every signed wallet transaction batch",
      "Looking up getEpochInfo a single time at the start of each session start",
    ],
    answer:0,
    explain:"The polling loop on getSignaturesForAddress and getProgramAccounts is the canonical ChainStream replacement target." },
  { id:"e9", topic:"sig", level:"expert",
    q:"What is the broader competitive landscape Sig sits inside today on Solana mainnet?",
    options:[
      "Three clients: Agave (Rust), Firedancer (C), and Sig (Zig), all on Solana",
      "Two clients: Agave and Firedancer, with Sig still in alpha pre-mainnet now",
      "Five clients including Agave, Firedancer, Sig, Bahamut, and Stratos client",
      "One client: Agave, with Sig as a fork waiting to be merged upstream now",
    ],
    answer:0,
    explain:"Solana's validator client diversity story is Agave (Rust, formerly Solana Labs), Firedancer (C, Jump Crypto), and Sig (Zig, Syndica)." },
  { id:"e10", topic:"read-write", level:"expert",
    q:"What is the practical case for streaming over polling at the indexer-pressure tier?",
    options:[
      "Lower RPC cost, lower latency to state changes, fewer dropped events at peak",
      "Higher cost but easier billing, since streaming is metered by the second now",
      "Same cost, just different shape, driven entirely by developer code style now",
      "Lower latency only, costs increase due to per-message subscription overhead",
    ],
    answer:0,
    explain:"Streaming reduces volume (fewer redundant calls), latency (push vs pull), and dropped events at peak. The cost win compounds at indexer scale." },
  { id:"e11", topic:"validator-research", level:"expert",
    q:"Why do infrastructure providers like Syndica typically also publish ecosystem research?",
    options:[
      "Research drives developer mindshare and builds long-term enterprise pipeline",
      "Research is mandated by Solana Foundation grants for infrastructure vendors",
      "Research is the only legally allowed marketing for blockchain infrastructure",
      "Research is published by every node operator under a Solana protocol rule",
    ],
    answer:0,
    explain:"Public research builds developer mindshare and credibility, creating long-term enterprise pipeline. It is a soft moat alongside product." },
  { id:"e12", topic:"solana-infra", level:"expert",
    q:"How is Syndica positioned relative to Triton One and Helius among Solana RPC providers?",
    options:[
      "Three Solana-centric infra firms competing on RPC, streaming, and tooling",
      "Three EVM-only providers that occasionally serve Solana endpoint traffic only",
      "One large firm and two resellers reselling the same underlying capacity all",
      "Three subsidiaries of the Solana Foundation operating as one merged group",
    ],
    answer:0,
    explain:"Syndica, Triton One, and Helius are three independent Solana-centric infrastructure firms competing on RPC, streaming, indexing, and developer tools." },
];

const TOPIC_LABEL: Record<string, string> = {
  "syndica-cloud": "Syndica Cloud tiers",
  "chainstream": "ChainStream",
  "sig": "Sig validator",
  "read-write": "Read vs write pressure",
  "validator-research": "Validator and research",
  "solana-infra": "Solana infrastructure",
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
              Test your knowledge of Syndica Cloud tiers (Standard Lite, Standard, Scale at $199, HyperScale),
              ChainStream WebSocket streaming, the Sig validator client, the 25 to 1 read to write ratio that drives
              Sig's design, the Syndica validator and research program, and the broader Solana infrastructure landscape.
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
