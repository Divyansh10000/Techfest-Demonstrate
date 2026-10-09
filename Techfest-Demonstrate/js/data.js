/* Techfest 2026 — central content + data layer.
   Exposes window.TF for all pages. No build step required. */
window.TF = window.TF || {};

TF.meta = {
  name: "Techfest",
  host: "IIT Bombay",
  edition: "XXIX",
  editionRoman: "Edition XXIX · 29 years",
  theme: "An Astral Experience",
  start: "2026-12-16T09:30:00+05:30",
  end: "2026-12-18T22:00:00+05:30",
  dateLabel: "16–18 December 2026",
  city: "Powai, Mumbai",
  venue: "IIT Bombay",
  coords: "19.1334° N · 72.9133° E",
  official: "https://techfest.org",
  iitb: "https://www.iitb.ac.in"
};

TF.stats = [
  { value: 175000, suffix: "K+", prefix: "", label: "Footfall", note: "Visitors across three days — every Indian state and 30+ countries." },
  { value: 29, suffix: "", prefix: "", label: "Editions", note: "Student-run since 1998 — Asia's largest science & technology festival." },
  { value: 50, suffix: "+", prefix: "", label: "Competitions", note: "Robotics, code, design and wild ideas, with national zonals." },
  { value: 2000, suffix: "+", prefix: "", label: "Colleges", note: "Campuses represented on the competitor and delegate floors." },
  { value: 120, suffix: "L+", prefix: "₹", label: "Lakh prize pool", note: "Total prize money across all competitive events this edition." },
  { value: 40, suffix: "K+", prefix: "", label: "Workshop seats", note: "Certified hands-on seats filled across the workshop track." },
  { value: 40, suffix: "+", prefix: "", label: "Speakers", note: "Faculty, founders, scientists and industry leaders across lectures and panels." },
  { value: 29, suffix: "", prefix: "", label: "Years", note: "A continuous student-run legacy from 1998 to 2026." }
];

TF.pathways = [
  { id: "student", name: "Student", line: "Compete, learn and meet the people building what is next.", action: "See student tracks", match: ["competitions", "workshops", "lectures", "entertainment"] },
  { id: "builder", name: "Builder", line: "Prototype under pressure in arenas built for makers.", action: "Enter the arenas", match: ["competitions", "robowars", "workshops"] },
  { id: "researcher", name: "Researcher", line: "Talks, papers and labs where frontier work goes public.", action: "Find the frontier", match: ["lectures", "exhibitions", "workshops"] },
  { id: "startup", name: "Startup", line: "Show the product, meet talent, and find your next hire.", action: "Pitch and exhibit", match: ["exhibitions", "lectures"] },
  { id: "visitor", name: "Visitor", line: "Three days of spectacle — robots, shows and the future on a table.", action: "Plan your visit", match: ["robowars", "exhibitions", "entertainment", "lectures"] }
];

TF.pillars = [
  { id: "compete", name: "Compete", kicker: "Arenas", line: "Fifty arenas where a year of work meets one unforgiving run.", to: "events.html?cat=competitions" },
  { id: "learn", name: "Learn", kicker: "Studio", line: "Certified workshops and masterclasses led by faculty and industry.", to: "events.html?cat=workshops" },
  { id: "discover", name: "Discover", kicker: "Expo", line: "Exhibitions where the machine on the table is already the future.", to: "events.html?cat=exhibitions" },
  { id: "experience", name: "Experience", kicker: "Night", line: "Robowars, Technoholix, lights and music — the festival as spectacle.", to: "events.html?cat=entertainment" }
];

TF.categories = [
  { id: "all", name: "Everything" },
  { id: "competitions", name: "Competitions" },
  { id: "workshops", name: "Workshops" },
  { id: "lectures", name: "Lectures" },
  { id: "exhibitions", name: "Exhibitions" },
  { id: "robowars", name: "Robowars" },
  { id: "entertainment", name: "Technoholix" }
];

TF.venues = [
  { id: "convocation", name: "Convocation Hall", zone: "Academic Core", note: "1,600-seat auditorium for keynotes and marquee lectures." },
  { id: "ltc", name: "Lecture Theatre Complex", zone: "Academic Core", note: "Parallel tracks for lectures, panels and masterclasses." },
  { id: "expo", name: "Exhibition Hall", zone: "North Lawn", note: "Indoor pavilion for exhibitions and technology installations." },
  { id: "arena", name: "Robotics Arena", zone: "Gymkhana Grounds", note: "Caged competition floor for Robowars and fighting robots." },
  { id: "oat", name: "Open Air Theatre", zone: "Powai Lake Lawns", note: "Main stage for Technoholix, live music and light shows." },
  { id: "labs", name: "Workshop Labs", zone: "Academic Core", note: "Bench seats for certified hands-on workshop tracks." },
  { id: "grounds", name: "Main Grounds", zone: "Central", note: "Outdoor circuits, drag strips and drone flight enclosures." },
  { id: "lakeside", name: "Lakeside Lawns", zone: "Powai Lake", note: "Open festival grounds, food court and evening programming." },
  { id: "hangar", name: "Innovation Hangar", zone: "North Lawn", note: "Startup and research floor for demos and recruitment." }
];

TF.events = [
  {
    id: "irc",
    title: "International Robotics Challenge",
    category: "competitions",
    pathways: ["builder", "student"],
    featured: true,
    tagline: "Build a machine. Survive the terrain. Take the title.",
    blurb: "The continent's most-watched student robotics war returns with a harsher arena and a tighter clock.",
    description: "Teams design and build autonomous and manually-controlled robots to complete hostile terrain missions against the clock. IRC has been Techfest's flagship robotics event since its earliest editions, drawing teams from engineering campuses across Asia. This year's arena adds moving hazards, a resource-collection objective and a blackout phase that forces onboard autonomy.",
    date: "16 Dec 2026", time: "09:00 onwards", venue: "Robotics Arena", venueId: "arena",
    prize: "₹8,00,000 + internship offers", eligibility: "Undergraduate and postgraduate teams of 3–6",
    deadline: "10 Nov 2026", status: "open", fee: "₹1,200 per team", teamSize: "3–6",
    format: "Zonals across 12 cities → 24 teams → campus finale",
    highlights: ["Six-hour endurance finale", "Autonomy blackout phase", "Live broadcast from the arena"],
    contact: "irc@techfest.org",
    faqs: [
      { q: "Can first-year students enter?", a: "Yes. Teams are ranked in an underclass bracket alongside the open bracket." },
      { q: "Is a kit provided?", a: "A base chassis kit is available for purchase; custom builds are encouraged and score higher on innovation." }
    ]
  },
  {
    id: "codestorm",
    title: "Codestorm",
    category: "competitions",
    pathways: ["builder", "student", "researcher"],
    featured: true,
    tagline: "Algorithms under floodlights.",
    blurb: "India's fiercest student algorithmic contest, run over a live scoreboard in front of a crowd.",
    description: "A multi-round competitive programming battle covering data structures, graph theory, dynamic programming and approximation. The on-campus finale runs on a live leaderboard projected across the hall, with problem setters from competitive programming and industry. The final problem is revealed only after the halfway freeze.",
    date: "17 Dec 2026", time: "11:00–17:00", venue: "Lecture Theatre Complex", venueId: "ltc",
    prize: "₹5,00,000 + interview fast-tracks", eligibility: "Open to all enrolled students",
    deadline: "05 Dec 2026", status: "open", fee: "Free", teamSize: "Solo or pairs",
    format: "Online qualifiers → 200 finalists → live onsite final",
    highlights: ["Live crowd leaderboard", "Halfway freeze twist", "Industry problem setters"],
    contact: "codestorm@techfest.org",
    faqs: [
      { q: "Which languages are allowed?", a: "C++, Java, Python and Rust are all supported on the judging sandbox." },
      { q: "Can I participate online?", a: "Qualifiers are online; the finale is strictly on campus." }
    ]
  },
  {
    id: "robowars",
    title: "Robowars Championship",
    category: "robowars",
    pathways: ["builder", "visitor", "student"],
    featured: true,
    flagship: true,
    tagline: "Two machines enter the cage. One leaves standing.",
    blurb: "The heavyweight arena spectacle of the festival — 15kg and 60kg classes, in a caged pit.",
    description: "Robowars is Techfest's loudest event. Fighting robots in two weight classes meet in a shatter-proof caged arena for three-minute bouts decided by knockout or judges' decision. Flamethrowers, wedges, hammers and spinners are inspected for safety before the pit. The finale is a full-screen arena production with a live countdown, pyro and crowd scoring.",
    date: "18 Dec 2026", time: "14:00–22:00", venue: "Robotics Arena", venueId: "arena",
    prize: "₹12,00,000 across both classes", eligibility: "Teams of 2–8, any institution",
    deadline: "28 Nov 2026", status: "closing-soon", fee: "₹2,500 per bot", teamSize: "2–8",
    format: "Safety inspection → group bouts → knockout rounds → grand final",
    highlights: ["Caged shatter-proof arena", "15kg and 60kg classes", "Pyro finale under lights"],
    contact: "robowars@techfest.org",
    faqs: [
      { q: "What weapons are banned?", a: "Liquid weapons, untethered projectiles, and any system that fails the burst-pressure inspection." },
      { q: "Is there a pit crew area?", a: "Yes — each team gets a powered pit bay with compressed air and spare-parts access." }
    ]
  },
  {
    id: "meshmerize",
    title: "Meshmerize",
    category: "competitions",
    pathways: ["builder", "student"],
    tagline: "Line-followers and maze-solvers, in silicon poetry.",
    blurb: "Autonomous bots trace a track that reconfigures between heats, with no operator in the loop.",
    description: "Teams build fully autonomous line-following robots that must trace a high-speed track with sharp turns, gaps and a colour-inversion segment. The circuit is partially re-routed between rounds, so tuning to a single track does not survive the day. Timing is to the millisecond.",
    date: "17 Dec 2026", time: "10:00–16:00", venue: "Main Grounds", venueId: "grounds",
    prize: "₹2,00,000", eligibility: "Teams of 2–4",
    deadline: "12 Nov 2026", status: "open", fee: "₹600 per team", teamSize: "2–4",
    format: "Timed heats → quarter-finals → final sprint",
    highlights: ["Track re-routed between rounds", "Millisecond timing gates", "Colour-inversion segment"],
    contact: "meshmerize@techfest.org",
    faqs: [{ q: "How small can the bot be?", a: "Maximum footprint is 25cm × 25cm; weight is capped at 2kg." }]
  },
  {
    id: "fullthrottle",
    title: "Full Throttle",
    category: "competitions",
    pathways: ["builder", "visitor"],
    tagline: "Speed as a scientific instrument.",
    blurb: "Remote-controlled machines race for the fastest lap on a campus street circuit.",
    description: "A high-voltage RC racing event across a purpose-built campus circuit with chicanes, a jump and a pit-lane sprint. Machines are inspected for braking and telemetry. The final is a multi-lap race with a mandatory pit stop and live timing.",
    date: "18 Dec 2026", time: "09:00–13:00", venue: "Main Grounds", venueId: "grounds",
    prize: "₹3,00,000", eligibility: "Teams of 2–5",
    deadline: "20 Nov 2026", status: "open", fee: "₹900 per team", teamSize: "2–5",
    format: "Time trials → semi-finals → grand prix",
    highlights: ["Street circuit with airtime", "Live timing telemetry", "Mandatory pit stop in the final"],
    contact: "fullthrottle@techfest.org",
    faqs: [{ q: "Battery limits?", a: "Maximum 22.2V LiPo; all packs are inspected and logged." }]
  },
  {
    id: "aerostorm",
    title: "Aerostorm",
    category: "competitions",
    pathways: ["builder", "researcher", "visitor"],
    tagline: "Leave the ground.",
    blurb: "Unmanned aerial systems run reconnaissance and payload missions in a netted flight enclosure.",
    description: "Teams design drones that fly autonomous waypoint missions, deliver a payload precisely and return without intervention. Scoring rewards mission completion, payload accuracy and degree of autonomy. Flights happen inside a netted enclosure for safety.",
    date: "17 Dec 2026", time: "13:00–18:00", venue: "Main Grounds", venueId: "grounds",
    prize: "₹3,50,000", eligibility: "Teams of 2–5",
    deadline: "18 Nov 2026", status: "open", fee: "₹900 per team", teamSize: "2–5",
    format: "Qualifier flights → mission rounds → final precision run",
    highlights: ["Fully autonomous waypoints", "Precision payload drop", "Netted safe flight zone"],
    contact: "aerostorm@techfest.org",
    faqs: [{ q: "Is GPS allowed?", a: "GPS assists waypoint navigation, but the final round includes a GPS-denied segment." }]
  },
  {
    id: "ideate",
    title: "Ideate",
    category: "competitions",
    pathways: ["builder", "startup", "student"],
    tagline: "From napkin to prototype.",
    blurb: "A design and innovation challenge for builders who think in systems.",
    description: "A structured innovation sprint where teams frame a real problem, design a solution and defend it to a panel of founders, designers and faculty. Finalist teams receive mentorship before the on-campus pitch. Judging weights problem framing, feasibility and craft of the prototype.",
    date: "16 Dec 2026", time: "10:00–15:00", venue: "Innovation Hangar", venueId: "hangar",
    prize: "₹4,00,000 + incubation", eligibility: "Teams of 2–5, open to all",
    deadline: "22 Nov 2026", status: "open", fee: "Free", teamSize: "2–5",
    format: "Submission → mentorship → on-campus pitch finale",
    highlights: ["Mentored finalists", "Founder and faculty panel", "Incubation follow-through"],
    contact: "ideate@techfest.org",
    faqs: [{ q: "Do I need a working prototype?", a: "A working prototype strengthens the entry but a rigorous design and validation plan is accepted." }]
  },
  {
    id: "hydraulics",
    title: "Hydraulics",
    category: "competitions",
    pathways: ["builder", "student"],
    tagline: "Pressure, pivots and precision.",
    blurb: "Hydraulic machines lift, move and place under load against the clock.",
    description: "Teams build manually-controlled hydraulic machines that must lift, transport and place a payload into a marked zone using only fluid-powered linkages. No electric actuation is permitted. Scoring is based on precision, cycle time and build quality.",
    date: "17 Dec 2026", time: "14:00–17:00", venue: "Exhibition Hall", venueId: "expo",
    prize: "₹1,50,000", eligibility: "Teams of 2–4",
    deadline: "15 Nov 2026", status: "open", fee: "₹500 per team", teamSize: "2–4",
    format: "Qualifying run → precision final",
    highlights: ["No electric actuation", "Load-bearing precision", "Build-craft scoring"],
    contact: "hydraulics@techfest.org",
    faqs: [{ q: "Can we use servo valves?", a: "Electrically-actuated valves are not permitted; purely manual control is required." }]
  },
  {
    id: "bridgeblitz",
    title: "Bridge Blitz",
    category: "competitions",
    pathways: ["builder", "student"],
    tagline: "Span the gap. Hold the load. Break the record.",
    blurb: "A structural engineering showdown — build the strongest bridge from limited materials.",
    description: "Teams design and construct a bridge using only the provided materials — balsa wood, adhesive and string — within a strict time and dimension budget. Bridges are loaded to destruction on a test rig, and scoring rewards load-to-weight ratio, structural efficiency and design documentation. The event culminates in a live load-testing finale before a crowd.",
    date: "17 Dec 2026", time: "09:00–13:00", venue: "Exhibition Hall", venueId: "expo",
    prize: "₹2,50,000", eligibility: "Teams of 2–4",
    deadline: "14 Nov 2026", status: "open", fee: "₹700 per team", teamSize: "2–4",
    format: "Design window → build session → load-testing finale",
    highlights: ["Load-to-weight scoring", "Live destruction testing", "Design report judged"],
    contact: "bridgeblitz@techfest.org",
    faqs: [
      { q: "What materials are provided?", a: "Balsa wood strips, PVA adhesive and cotton string. No other structural materials are permitted." },
      { q: "Is there a span requirement?", a: "Yes — the bridge must span a 40cm gap and support a central loading plate." }
    ]
  },
  {
    id: "aerodesign",
    title: "Aero Design",
    category: "competitions",
    pathways: ["builder", "researcher", "student"],
    tagline: "Design it. Build it. Fly it.",
    blurb: "Aircraft design challenge from concept to controlled flight in one weekend.",
    description: "Teams design, build and fly a radio-controlled aircraft to complete a set of flight missions: duration, payload carriage and precision landing. Aircraft must pass a technical inspection before flight. Scoring combines mission performance, design innovation and a technical presentation. The event runs over two days with a fly-off finale on the Main Grounds.",
    date: "17–18 Dec 2026", time: "10:00–17:00", venue: "Main Grounds", venueId: "grounds",
    prize: "₹4,00,000", eligibility: "Teams of 3–6",
    deadline: "16 Nov 2026", status: "open", fee: "₹1,000 per team", teamSize: "3–6",
    format: "Design review → technical inspection → flight missions → fly-off finale",
    highlights: ["Payload carriage mission", "Precision landing challenge", "Technical presentation judged"],
    contact: "aerodesign@techfest.org",
    faqs: [
      { q: "Can we use a kit aircraft?", a: "Kit airframes are permitted, but modifications and original design elements score higher on innovation." },
      { q: "Is there a wingspan limit?", a: "Maximum wingspan is 2.5 metres; all aircraft must pass a pre-flight safety inspection." }
    ]
  },
  {
    id: "codesprint",
    title: "Code Sprint",
    category: "competitions",
    pathways: ["builder", "student", "startup"],
    tagline: "24 hours. One problem. Ship something real.",
    blurb: "A hackathon-style sprint where teams build a working product in a single day.",
    description: "Code Sprint is a 24-hour product-building challenge. Teams receive a problem statement at kickoff and must design, build and demo a working software solution by the following morning. Mentors from industry are available throughout the night. Judging weights working functionality, technical depth, design quality and the final demo. The event runs overnight in the Workshop Labs.",
    date: "17–18 Dec 2026", time: "18:00 → 18:00", venue: "Workshop Labs", venueId: "labs",
    prize: "₹6,00,000 + incubation interviews", eligibility: "Teams of 2–4, open to all",
    deadline: "08 Dec 2026", status: "open", fee: "₹800 per team", teamSize: "2–4",
    format: "Kickoff → 24-hour build → morning demos → judging",
    highlights: ["Overnight build with mentors", "Working demo required", "Incubation fast-track for winners"],
    contact: "codesprint@techfest.org",
    faqs: [
      { q: "What tech stack can we use?", a: "Any stack. Cloud credits and API keys are provided for common platforms." },
      { q: "Do we need to build from scratch?", a: "Yes — all code must be written during the 24-hour window. Boilerplate and libraries are fine." }
    ]
  },
  {
    id: "deeplearning",
    title: "Deep Learning with PyTorch",
    category: "workshops",
    pathways: ["student", "researcher", "builder"],
    featured: true,
    tagline: "Train your first real network — properly.",
    blurb: "A certified, hands-on track from tensors to a deployed model.",
    description: "A two-day certified workshop covering tensors, autograd, convolutional and transformer architectures, training loops, evaluation and lightweight deployment. Jupyter labs run on provisioned GPUs, and participants leave with a working model and a completion certificate issued with IIT Bombay faculty involvement.",
    date: "16–17 Dec 2026", time: "09:30–16:00", venue: "Workshop Labs", venueId: "labs",
    prize: "", eligibility: "Open to all; basic Python assumed",
    deadline: "08 Dec 2026", status: "open", fee: "₹1,800", teamSize: "Individual",
    format: "Two-day guided lab with capstone",
    instructor: "IIT Bombay faculty + industry ML engineers",
    curriculum: ["Tensors and autograd", "Convolutional networks", "Transformers and attention", "Training, evaluation and overfitting", "Deployment and inference cost"],
    highlights: ["GPU-backed labs", "Capstone model", "Certificate"],
    contact: "workshops@techfest.org",
    faqs: [{ q: "Do I need my own laptop?", a: "Yes, a laptop; compute is on hosted GPU sessions. Bring a Google-Colab-class setup as a fallback." }]
  },
  {
    id: "autonomous-robotics",
    title: "Autonomous Robotics with ROS 2",
    category: "workshops",
    pathways: ["builder", "student", "researcher"],
    tagline: "Perception, planning and control — connected.",
    blurb: "Build a simulated autonomous robot stack on ROS 2, sensors to navigation.",
    description: "A hands-on track that assembles a full autonomy stack: nodes and topics, sensor fusion, SLAM, path planning and PID control. Participants simulate a differential-drive robot with LiDAR, run mapping and navigation, then transfer the pipeline to a physical testbot on the final module.",
    date: "17–18 Dec 2026", time: "09:30–16:00", venue: "Workshop Labs", venueId: "labs",
    prize: "", eligibility: "Open to all; C++ or Python helpful",
    deadline: "08 Dec 2026", status: "open", fee: "₹2,000", teamSize: "Individual",
    format: "Two-day guided lab with testbot module",
    instructor: "Robotics engineers + student lab leads",
    curriculum: ["ROS 2 nodes, topics, services", "Sensor fusion and odometry", "SLAM and mapping", "Path planning", "Control and the testbot"],
    highlights: ["Simulation to hardware", "LiDAR mapping lab", "Certificate"],
    contact: "workshops@techfest.org",
    faqs: [{ q: "Is prior ROS experience needed?", a: "No. The first module assumes no ROS background." }]
  },
  {
    id: "cubesat",
    title: "CubeSat and Space Systems",
    category: "workshops",
    pathways: ["researcher", "student", "builder"],
    tagline: "Design for the smallest orbit.",
    blurb: "Mission design, subsystems and link budgets for small satellites.",
    description: "A focused track on small-satellite engineering: mission objectives, power, attitude determination, communications and link budgets. Teams design a CubeSat mission and defend it against a review panel in a mini design review, mirroring how real space missions are assessed.",
    date: "16 Dec 2026", time: "10:00–17:00", venue: "Lecture Theatre Complex", venueId: "ltc",
    prize: "", eligibility: "Open to all; physics and electronics helpful",
    deadline: "06 Dec 2026", status: "open", fee: "₹1,500", teamSize: "Individual or pairs",
    format: "One-day intensive with design review",
    instructor: "Space systems engineers and alumni",
    curriculum: ["Mission and orbit basics", "Power and thermal", "Attitude determination", "Communications and link budget", "Design review"],
    highlights: ["Mini design review", "Link budget tooling", "Certificate"],
    contact: "workshops@techfest.org",
    faqs: [{ q: "Is this about building hardware?", a: "It is a design and systems track; hardware is optional in the final module." }]
  },
  {
    id: "genai",
    title: "Generative AI and LLM Engineering",
    category: "workshops",
    pathways: ["builder", "startup", "student"],
    tagline: "From prompts to production systems.",
    blurb: "Embeddings, retrieval, evaluation and shipping an LLM application responsibly.",
    description: "A practitioner's track on building with large language models: tokenisation and embeddings, retrieval-augmented generation, prompt and system design, evaluation, guardrails and cost. Participants ship a working retrieval-augmented application and leave with an evaluation harness.",
    date: "18 Dec 2026", time: "09:30–16:00", venue: "Workshop Labs", venueId: "labs",
    prize: "", eligibility: "Open to all; some Python assumed",
    deadline: "09 Dec 2026", status: "open", fee: "₹2,000", teamSize: "Individual",
    format: "One-day build lab",
    instructor: "Applied AI engineers",
    curriculum: ["Embeddings and vector search", "Retrieval-augmented generation", "System and prompt design", "Evaluation and guardrails", "Cost and deployment"],
    highlights: ["Ship a RAG app", "Evaluation harness", "Certificate"],
    contact: "workshops@techfest.org",
    faqs: [{ q: "Do I need an API key?", a: "Sandboxed keys are provided for the lab; you may also bring your own." }]
  },
  {
    id: "dronebuilding",
    title: "Drone Building and Flight",
    category: "workshops",
    pathways: ["builder", "visitor", "student"],
    tagline: "Assemble it. Tune it. Fly it.",
    blurb: "Build a working quadcopter and fly it in a supervised enclosure.",
    description: "A build-and-fly track: frames, motors, ESCs, flight controllers, radio setup and PID tuning, ending with supervised flight in the netted enclosure. Each team leaves with a flying machine and the knowledge to keep maintaining it safely.",
    date: "17 Dec 2026", time: "10:00–17:00", venue: "Main Grounds", venueId: "grounds",
    prize: "", eligibility: "Open to all",
    deadline: "07 Dec 2026", status: "open", fee: "₹2,500 (kit included)", teamSize: "Teams of 2",
    format: "One-day build and fly",
    instructor: "FPV and UAV builders",
    curriculum: ["Frame and power train", "ESCs and flight controller", "Radio and failsafe", "PID tuning", "Supervised flight"],
    highlights: ["Take-home quadcopter", "PID tuning lab", "Certificate"],
    contact: "workshops@techfest.org",
    faqs: [{ q: "Can I keep the drone?", a: "Yes, the kit is included in the fee and yours to keep." }]
  },
  {
    id: "cyberdefense",
    title: "Cyber Defense and Ethical Security",
    category: "workshops",
    pathways: ["builder", "researcher", "student"],
    tagline: "Think like an attacker. Build like a defender.",
    blurb: "A defensive security track across hardening, detection and incident response.",
    description: "A defensive, blue-team workshop on securing systems: threat modelling, hardening, logging and detection, and incident-response playbooks. All exercises run in an isolated lab against provisioned vulnerable-by-design targets, with an emphasis on defence and responsible disclosure.",
    date: "18 Dec 2026", time: "10:00–16:00", venue: "Workshop Labs", venueId: "labs",
    prize: "", eligibility: "Open to all; networking and Linux basics helpful",
    deadline: "09 Dec 2026", status: "open", fee: "₹1,800", teamSize: "Individual",
    format: "One-day isolated-lab track",
    instructor: "Security engineers and CERT-aligned mentors",
    curriculum: ["Threat modelling", "Host and network hardening", "Logging and detection", "Incident response playbooks", "Responsible disclosure"],
    highlights: ["Isolated lab range", "Blue-team detection build", "Certificate"],
    contact: "workshops@techfest.org",
    faqs: [{ q: "Is this an offensive hacking course?", a: "No. The lab is defensive and isolated; the focus is hardening, detection and response." }]
  },
  {
    id: "arduinoworkshop",
    title: "Embedded Systems with Arduino",
    category: "workshops",
    pathways: ["builder", "student", "researcher"],
    tagline: "From blinking LEDs to real embedded products.",
    blurb: "A hands-on track on microcontrollers, sensors, actuators and real-time systems.",
    description: "A two-day certified workshop on embedded systems using Arduino and compatible platforms. Participants work through GPIO, ADC, PWM, serial communication, sensor integration and interrupt-driven design, culminating in a capstone project that combines multiple subsystems into a working embedded product. All hardware is provided for the lab.",
    date: "16–17 Dec 2026", time: "09:30–16:00", venue: "Workshop Labs", venueId: "labs",
    prize: "", eligibility: "Open to all; no prior experience required",
    deadline: "07 Dec 2026", status: "open", fee: "₹1,500", teamSize: "Individual",
    format: "Two-day guided lab with capstone project",
    instructor: "Embedded systems engineers and IIT Bombay alumni",
    curriculum: ["GPIO and digital I/O", "ADC and analogue sensors", "PWM and motor control", "Serial communication and protocols", "Interrupts and real-time design", "Capstone embedded product"],
    highlights: ["All hardware provided", "Capstone project", "Certificate"],
    contact: "workshops@techfest.org",
    faqs: [
      { q: "Do I need to know C++?", a: "Basic programming familiarity helps, but the first module starts from the fundamentals." },
      { q: "Can I take the kit home?", a: "The lab kits are for use during the workshop; a take-home bundle is available for an additional fee." }
    ]
  },
  {
    id: "printing3d",
    title: "3D Printing and Prototyping",
    category: "workshops",
    pathways: ["builder", "student", "startup"],
    tagline: "Design it today. Hold it tomorrow.",
    blurb: "From CAD model to printed part — a complete prototyping workflow.",
    description: "A one-day intensive on additive manufacturing and rapid prototyping. Participants learn CAD fundamentals, design for additive manufacturing, slicer setup, material selection and post-processing. The afternoon is a supervised print session where each participant prints and takes home a part they designed. Design files and printer access are provided.",
    date: "18 Dec 2026", time: "09:30–17:00", venue: "Workshop Labs", venueId: "labs",
    prize: "", eligibility: "Open to all; no CAD experience required",
    deadline: "10 Dec 2026", status: "open", fee: "₹1,200", teamSize: "Individual",
    format: "One-day design and print intensive",
    instructor: "Product designers and additive manufacturing specialists",
    curriculum: ["CAD fundamentals", "Design for additive manufacturing", "Slicer setup and orientation", "Materials: PLA, PETG, TPU and composites", "Post-processing and finishing", "Supervised print session"],
    highlights: ["Print and keep your part", "Design-for-AM principles", "Certificate"],
    contact: "workshops@techfest.org",
    faqs: [
      { q: "Do I need to know CAD?", a: "No — the workshop starts with CAD fundamentals and guides you through a first model." },
      { q: "What can I print?", a: "Each participant prints one part within a 15cm³ volume limit. Larger prints can be queued for post-event delivery." }
    ]
  },
  {
    id: "lectures-orbit",
    title: "The Orbit Lecture",
    category: "lectures",
    pathways: ["researcher", "student", "visitor"],
    featured: true,
    tagline: "From the dais to the deep field.",
    blurb: "India's space programme, told by the people who fly it.",
    description: "A marquee lecture on India's space ambitions, from launch vehicles to human spaceflight and planetary science, followed by an open audience session. Techfest has hosted ISRO leadership on this dais for years; the Orbit lecture continues that lineage in 2026.",
    date: "16 Dec 2026", time: "11:00–12:30", venue: "Convocation Hall", venueId: "convocation",
    prize: "", eligibility: "Open to all (seat reservation)", deadline: "15 Dec 2026",
    status: "open", fee: "Free", teamSize: "", format: "Keynote + moderated Q&A",
    speakerRole: "ISRO leadership and mission scientists",
    highlights: ["Human spaceflight briefing", "Open Q&A", "Live-streamed to overflow halls"],
    contact: "lectures@techfest.org",
    faqs: [{ q: "Can I ask questions?", a: "Yes — a moderated Q&A follows, with queue tickets on the floor." }]
  },
  {
    id: "lectures-command",
    title: "The Command Lecture",
    category: "lectures",
    pathways: ["researcher", "student", "visitor"],
    tagline: "Strategy, sovereignty and the science of defence.",
    blurb: "A conversation on technology, security and national capability.",
    description: "A candid, moderated conversation with senior defence and strategic leadership on how technology reshapes security, acquisition and self-reliance. The session prioritises questions from students and researchers.",
    date: "17 Dec 2026", time: "11:00–12:15", venue: "Convocation Hall", venueId: "convocation",
    prize: "", eligibility: "Open to all (seat reservation)", deadline: "15 Dec 2026",
    status: "open", fee: "Free", teamSize: "", format: "Moderated conversation + Q&A",
    speakerRole: "Senior defence and strategic leadership",
    highlights: ["Moderated conversation", "Student-first Q&A", "Policy and technology"],
    contact: "lectures@techfest.org",
    faqs: [{ q: "Is photography allowed?", a: "Stills are permitted; recording follows the official media policy." }]
  },
  {
    id: "lectures-machine",
    title: "The Machine Lecture",
    category: "lectures",
    pathways: ["researcher", "builder", "student"],
    tagline: "When a machine first walked here.",
    blurb: "Robotics, embodiment and the long road to useful machines.",
    description: "A lecture on robotics and embodied intelligence — humanoids, manipulation, locomotion and the gap between a viral demo and a machine that earns its keep. Featured researchers and builders discuss what actually generalises beyond the lab.",
    date: "18 Dec 2026", time: "11:00–12:15", venue: "Convocation Hall", venueId: "convocation",
    prize: "", eligibility: "Open to all (seat reservation)", deadline: "15 Dec 2026",
    status: "open", fee: "Free", teamSize: "", format: "Keynote + panel",
    speakerRole: "Robotics researchers and founders",
    highlights: ["Humanoid and manipulation demos", "Research-to-product panel", "Open Q&A"],
    contact: "lectures@techfest.org",
    faqs: [{ q: "Will there be demos?", a: "Selected demonstrations follow the panel in the adjacent exhibition hall." }]
  },
  {
    id: "lectures-signal",
    title: "The Signal Lecture",
    category: "lectures",
    pathways: ["researcher", "startup", "student"],
    tagline: "The marquee speaker, revealed last.",
    blurb: "Techfest's headline talk — announced closer to the festival.",
    description: "The Signal lecture is the marquee keynote, whose speaker is revealed closer to December. Past editions have hosted astronauts, inventors and founders who refuse to stay theoretical. Reserve a seat early; this hall fills first.",
    date: "16 Dec 2026", time: "18:00–19:30", venue: "Convocation Hall", venueId: "convocation",
    prize: "", eligibility: "Open to all (seat reservation)", deadline: "15 Dec 2026",
    status: "announcing", fee: "Free", teamSize: "", format: "Headline keynote",
    speakerRole: "To be announced",
    highlights: ["Marquee keynote", "Revealed closer to December", "Reserve early"],
    contact: "lectures@techfest.org",
    faqs: [{ q: "When is the speaker announced?", a: "Watch the official channel — announcements land in the weeks before the festival." }]
  },
  {
    id: "lectures-quantum",
    title: "The Quantum Lecture",
    category: "lectures",
    pathways: ["researcher", "student", "builder"],
    tagline: "Superposition, entanglement and the next computing revolution.",
    blurb: "Quantum computing explained by the people building the machines.",
    description: "A frontier lecture on quantum computing — qubits, gates, error correction and the algorithms that could redefine cryptography, materials and optimisation. The session covers where the technology actually stands, what is hype and what is real, and how students can enter the field. A live Q&A follows the talk.",
    date: "17 Dec 2026", time: "14:00–15:30", venue: "Lecture Theatre Complex", venueId: "ltc",
    prize: "", eligibility: "Open to all (seat reservation)", deadline: "15 Dec 2026",
    status: "open", fee: "Free", teamSize: "", format: "Keynote + live Q&A",
    speakerRole: "Quantum computing researchers and industry leads",
    highlights: ["Live quantum circuit demo", "Error correction explained", "Career pathways in quantum"],
    contact: "lectures@techfest.org",
    faqs: [
      { q: "Do I need a physics background?", a: "No — the lecture is designed for a general technical audience and explains concepts from first principles." },
      { q: "Will there be a hands-on component?", a: "A cloud-based quantum processor will be accessible for a live demonstration during the talk." }
    ]
  },
  {
    id: "lectures-climate",
    title: "The Climate Lecture",
    category: "lectures",
    pathways: ["researcher", "student", "startup"],
    tagline: "The technology of a livable planet.",
    blurb: "Climate science, clean energy and the engineering of decarbonisation.",
    description: "A lecture on the technology behind climate action — renewable energy systems, carbon capture, grid storage, sustainable materials and climate modelling. Speakers from research, industry and policy discuss what is deployable today, what is emerging, and where the biggest engineering challenges remain. The session includes a moderated audience discussion.",
    date: "18 Dec 2026", time: "14:00–15:30", venue: "Lecture Theatre Complex", venueId: "ltc",
    prize: "", eligibility: "Open to all (seat reservation)", deadline: "15 Dec 2026",
    status: "open", fee: "Free", teamSize: "", format: "Keynote + panel + audience discussion",
    speakerRole: "Climate scientists, clean-energy engineers and policy experts",
    highlights: ["Deployable clean tech today", "Grid-scale storage deep dive", "Audience discussion"],
    contact: "lectures@techfest.org",
    faqs: [
      { q: "Is this a policy talk or a technology talk?", a: "Primarily technology — the focus is on engineering systems, with policy context where relevant." },
      { q: "Can I submit questions in advance?", a: "Yes — a question portal opens one week before the festival and selected questions are put to the panel." }
    ]
  },
  {
    id: "expo-international",
    title: "International Exhibitions",
    category: "exhibitions",
    pathways: ["visitor", "researcher", "startup"],
    featured: true,
    tagline: "Walk the floor of the near future.",
    blurb: "Robots, cubesats, drone swarms and pavilions from around the world.",
    description: "The exhibition floor gathers humanoids, satellites, drone systems, advanced manufacturing and international pavilions. Exhibits are staged as walkable installations, not posters — visitors can inspect, ask and, where safe, interact. This is where the abstract becomes physical.",
    date: "16–18 Dec 2026", time: "10:00–20:00", venue: "Exhibition Hall", venueId: "expo",
    prize: "", eligibility: "Open to all", deadline: "", status: "open", fee: "Free",
    teamSize: "", format: "Walkthrough pavilions",
    highlights: ["Humanoid and robotics zone", "Space and aerospace pavilion", "International delegations"],
    contact: "expo@techfest.org",
    faqs: [{ q: "Are exhibits interactive?", a: "Many are; safety-marshalled zones allow supervised interaction." }]
  },
  {
    id: "expo-innovations",
    title: "Innovations Pavilion",
    category: "exhibitions",
    pathways: ["startup", "researcher", "builder"],
    tagline: "The table where the future is already working.",
    blurb: "Deep-tech, research spinouts and student innovations, side by side.",
    description: "A curated pavilion of deep-tech startups, research spinouts and standout student projects. Each exhibit gets a bench, power and a slot on the demo stage. Investors and recruiters walk this floor with intent.",
    date: "16–18 Dec 2026", time: "10:00–20:00", venue: "Innovation Hangar", venueId: "hangar",
    prize: "", eligibility: "Open to all; demo applications separately", deadline: "20 Nov 2026",
    status: "open", fee: "Free (exhibit application required)", teamSize: "", format: "Curated exhibit + staged demos",
    highlights: ["Investor and recruiter floor", "Staged demo slots", "Student and research spinouts"],
    contact: "expo@techfest.org",
    faqs: [{ q: "Can my startup exhibit?", a: "Yes — apply through the demo application before 20 November." }]
  },
  {
    id: "expo-defence",
    title: "Aerospace and Defence Expo",
    category: "exhibitions",
    pathways: ["researcher", "visitor", "startup"],
    tagline: "Engineering under the hardest constraints.",
    blurb: "Platforms, systems and research from aerospace and defence technology.",
    description: "A focused expo on aerospace and defence technology: propulsion, avionics, materials, sensing and simulation. The pavilion includes research demonstrations and industry exhibits, with daily technical talks on the floor stage.",
    date: "17–18 Dec 2026", time: "10:00–19:00", venue: "Exhibition Hall", venueId: "expo",
    prize: "", eligibility: "Open to all (registration at entry)", deadline: "", status: "open", fee: "Free",
    teamSize: "", format: "Pavilion + floor talks",
    highlights: ["Propulsion and avionics", "Simulation zones", "Daily technical floor talks"],
    contact: "expo@techfest.org",
    faqs: [{ q: "Is there restricted content?", a: "Some exhibits are display-only and marked accordingly." }]
  },
  {
    id: "expo-defence-pavilion",
    title: "Defence Technology Pavilion",
    category: "exhibitions",
    pathways: ["researcher", "visitor", "startup"],
    tagline: "Sovereign capability, on display.",
    blurb: "India's defence research and manufacturing ecosystem in one pavilion.",
    description: "A dedicated pavilion showcasing India's defence technology ecosystem — from radar and electronic warfare to unmanned systems, materials and simulation. Exhibits include working demonstrations, scale models and interactive displays. Daily technical briefings by defence scientists run on the pavilion stage.",
    date: "16–18 Dec 2026", time: "10:00–19:00", venue: "Exhibition Hall", venueId: "expo",
    prize: "", eligibility: "Open to all (registration at entry)", deadline: "", status: "open", fee: "Free",
    teamSize: "", format: "Pavilion + daily technical briefings",
    highlights: ["Radar and EW displays", "Unmanned systems zone", "Daily scientist briefings"],
    contact: "expo@techfest.org",
    faqs: [{ q: "Are there live demonstrations?", a: "Yes — scheduled demonstrations run every two hours on the pavilion stage." }]
  },
  {
    id: "expo-renewable",
    title: "Renewable Energy Showcase",
    category: "exhibitions",
    pathways: ["researcher", "visitor", "startup"],
    tagline: "The energy transition, in working hardware.",
    blurb: "Solar, wind, storage and smart-grid technology you can inspect up close.",
    description: "A showcase of renewable energy and grid technology — photovoltaic systems, small wind turbines, battery storage, smart inverters and grid-management software. Exhibits are live and connected, showing real-time generation and consumption data. Industry and research teams are on hand to explain the technology.",
    date: "16–18 Dec 2026", time: "10:00–19:00", venue: "Exhibition Hall", venueId: "expo",
    prize: "", eligibility: "Open to all", deadline: "", status: "open", fee: "Free",
    teamSize: "", format: "Live exhibits + data dashboards",
    highlights: ["Live generation dashboards", "Battery storage cutaway", "Smart-grid simulation"],
    contact: "expo@techfest.org",
    faqs: [{ q: "Is the showcase interactive?", a: "Yes — visitors can trigger scenarios on the smart-grid simulator and see real-time responses." }]
  },
  {
    id: "technoholix",
    title: "Technoholix",
    category: "entertainment",
    pathways: ["visitor", "student", "startup"],
    featured: true,
    tagline: "Night falls. The campus becomes a stage.",
    blurb: "The festival's closing spectacle — music, lights, projection and pyro.",
    description: "Technoholix is where Techfest turns from a competitive arena into pure spectacle. Three nights of live music, a projection-mapped main stage, laser and pyro choreography, and a campus-wide lighting installation. The final night closes the festival with a headline set.",
    date: "16–18 Dec 2026", time: "19:00–23:00", venue: "Open Air Theatre", venueId: "oat",
    prize: "", eligibility: "Open to all (festival pass)", deadline: "", status: "open", fee: "Included with pass",
    teamSize: "", format: "Three-night main stage",
    highlights: ["Projection-mapped stage", "Laser and pyro choreography", "Headline live set on day three"],
    contact: "technoholix@techfest.org",
    faqs: [{ q: "Is entry separate?", a: "Technoholix is included with the festival pass; day passes are limited." }]
  },
  {
    id: "lasershow",
    title: "Laser and Light Show",
    category: "entertainment",
    pathways: ["visitor", "student"],
    tagline: "The campus, redrawn in light.",
    blurb: "A nightly projection and laser show mapped across the Main Building.",
    description: "Each evening, the Main Building facade becomes a canvas for a projection-mapped show of lasers, drones and sound, telling the story of the festival and the campus. The show is designed to be watched from the lawns, with a synchronised audio broadcast.",
    date: "16–18 Dec 2026", time: "20:30–21:00", venue: "Main Grounds", venueId: "grounds",
    prize: "", eligibility: "Open to all", deadline: "", status: "open", fee: "Free",
    teamSize: "", format: "Nightly facade show",
    highlights: ["Projection mapping", "Synchronised audio broadcast", "Drone light formation"],
    contact: "technoholix@techfest.org",
    faqs: [{ q: "Where is the best view?", a: "The Main Grounds lawns face the facade directly." }]
  },
  {
    id: "gamingarena",
    title: "Gaming Arena and Esports",
    category: "entertainment",
    pathways: ["visitor", "student", "builder"],
    tagline: "Reflexes, brackets and a crowd.",
    blurb: "Esports brackets, a free-play floor and a retro arcade lane.",
    description: "A three-day arena for competitive gaming, casual play and retro arcade. Tournament brackets run on the main stage with crowd commentary, while the free-play floor and arcade lane stay open from morning to close.",
    date: "16–18 Dec 2026", time: "10:00–22:00", venue: "Exhibition Hall", venueId: "expo",
    prize: "₹2,00,000 tournament pool", eligibility: "Open to all; tournament registration applies",
    deadline: "10 Dec 2026", status: "open", fee: "Free play; tournaments per slot", teamSize: "Solo or squads",
    format: "Brackets + open floor",
    highlights: ["Crowd-commentated brackets", "Free-play floor", "Retro arcade lane"],
    contact: "gaming@techfest.org",
    faqs: [{ q: "Can I just play casually?", a: "Yes — the free-play floor is open all day without a bracket slot." }]
  },
  {
    id: "battleofbands",
    title: "Battle of Bands",
    category: "entertainment",
    pathways: ["visitor", "student"],
    tagline: "Original music. Live crowd. One stage.",
    blurb: "A live music competition for original bands — judged by a panel and the crowd.",
    description: "Battle of Bands is a live music competition where original bands perform on the Open Air Theatre stage across two evenings. Bands are judged on originality, musicianship and stage presence by a panel of musicians and producers, with a crowd-vote component. The final night crowns the Techfest champion band.",
    date: "17–18 Dec 2026", time: "19:00–22:00", venue: "Open Air Theatre", venueId: "oat",
    prize: "₹1,50,000 + studio session", eligibility: "Bands of 3–8 members; original material required",
    deadline: "05 Dec 2026", status: "open", fee: "Free (registration required)", teamSize: "3–8",
    format: "Heats → semi-finals → grand final",
    highlights: ["Original material only", "Panel + crowd voting", "Studio session prize"],
    contact: "bands@techfest.org",
    faqs: [
      { q: "Can we play covers?", a: "At least two of the three songs in a set must be original material." },
      { q: "Is backline provided?", a: "A standard backline (drums, amps, mics) is provided; additional gear must be declared at registration." }
    ]
  }
];

TF.schedule = [
  {
    day: "Day 1", date: "16 Dec 2026", theme: "Ignition",
    blocks: [
      { time: "09:30", title: "Gates open · Exhibition floors live", eventId: "expo-international", venue: "Exhibition Hall" },
      { time: "10:00", title: "International Robotics Challenge — heats", eventId: "irc", venue: "Robotics Arena" },
      { time: "10:00", title: "CubeSat and Space Systems workshop", eventId: "cubesat", venue: "Lecture Theatre Complex" },
      { time: "11:00", title: "The Orbit Lecture", eventId: "lectures-orbit", venue: "Convocation Hall" },
      { time: "13:00", title: "Ideate — design sprint", eventId: "ideate", venue: "Innovation Hangar" },
      { time: "14:00", title: "Deep Learning with PyTorch (day 1)", eventId: "deeplearning", venue: "Workshop Labs" },
      { time: "18:00", title: "The Signal Lecture — headline keynote", eventId: "lectures-signal", venue: "Convocation Hall" },
      { time: "19:00", title: "Technoholix — night one", eventId: "technoholix", venue: "Open Air Theatre" },
      { time: "20:30", title: "Laser and Light Show", eventId: "lasershow", venue: "Main Grounds" }
    ]
  },
  {
    day: "Day 2", date: "17 Dec 2026", theme: "Apogee",
    blocks: [
      { time: "09:00", title: "Full Throttle — grand prix heats", eventId: "fullthrottle", venue: "Main Grounds" },
      { time: "09:30", title: "Autonomous Robotics with ROS 2 (day 1)", eventId: "autonomous-robotics", venue: "Workshop Labs" },
      { time: "10:00", title: "Meshmerize — timed heats", eventId: "meshmerize", venue: "Main Grounds" },
      { time: "11:00", title: "The Command Lecture", eventId: "lectures-command", venue: "Convocation Hall" },
      { time: "11:00", title: "Codestorm — live finale", eventId: "codestorm", venue: "Lecture Theatre Complex" },
      { time: "13:00", title: "Aerostorm — mission rounds", eventId: "aerostorm", venue: "Main Grounds" },
      { time: "14:00", title: "Hydraulics — precision final", eventId: "hydraulics", venue: "Exhibition Hall" },
      { time: "17:00", title: "Robowars — group bouts", eventId: "robowars", venue: "Robotics Arena" },
      { time: "19:00", title: "Technoholix — night two", eventId: "technoholix", venue: "Open Air Theatre" }
    ]
  },
  {
    day: "Day 3", date: "18 Dec 2026", theme: "Afterglow",
    blocks: [
      { time: "09:00", title: "Full Throttle — grand final", eventId: "fullthrottle", venue: "Main Grounds" },
      { time: "09:30", title: "Generative AI and LLM Engineering", eventId: "genai", venue: "Workshop Labs" },
      { time: "10:00", title: "Cyber Defense and Ethical Security", eventId: "cyberdefense", venue: "Workshop Labs" },
      { time: "11:00", title: "The Machine Lecture", eventId: "lectures-machine", venue: "Convocation Hall" },
      { time: "14:00", title: "Robowars — knockout rounds to grand final", eventId: "robowars", venue: "Robotics Arena" },
      { time: "17:00", title: "IRC — endurance finale", eventId: "irc", venue: "Robotics Arena" },
      { time: "19:00", title: "Technoholix — closing night", eventId: "technoholix", venue: "Open Air Theatre" },
      { time: "22:00", title: "Closing gathering · champions named", eventId: "", venue: "Main Grounds" }
    ]
  }
];

TF.timeline = [
  { year: "1998", title: "The first edition", text: "Techfest begins at IIT Bombay as a student-run gathering of builders — small in scale, ambitious in intent." },
  { year: "2003", title: "Going national", text: "Participation spreads across Indian campuses as competitions and the exhibition floor grow." },
  { year: "2007", title: "Robotics takes hold", text: "Robotics events become flagship attractions and draw international teams for the first time." },
  { year: "2010", title: "The exhibition era", text: "The expo floor becomes a permanent fixture, hosting industry pavilions and research demonstrations alongside competitions." },
  { year: "2012", title: "The dais grows", text: "Guest lectures host astronauts, scientists and inventors, establishing the lecture hall as a launchpad." },
  { year: "2016", title: "A continental stage", text: "Techfest consolidates its position as Asia's largest science and technology festival." },
  { year: "2019", title: "Social initiative", text: "Outreach campaigns and pan-India zonals carry the festival's work into cities beyond Powai." },
  { year: "2021", title: "Hybrid resilience", text: "The festival adapts to hybrid formats, keeping competitions and talks alive through disruption." },
  { year: "2024", title: "175,000 strong", text: "Footfall crosses 175,000 across three days, with 30+ countries represented." },
  { year: "2026", title: "An Astral Experience", text: "The 29th edition reimagines the campus as a living observatory — and the festival as an ecosystem." }
];

TF.testimonials = [
  { quote: "Three days here did more for my robotics team than a semester of coursework. We came back with a plan.", name: "Aarav M.", role: "Team captain, robotics", place: "Undergraduate, Pune" },
  { quote: "The lecture hall felt like a launchpad. I walked out wanting to change what I worked on.", name: "Ishita R.", role: "Research student", place: "Mumbai" },
  { quote: "We hired two interns straight off the exhibition floor. The talent density is real.", name: "Karan S.", role: "Founder", place: "Deep-tech startup" },
  { quote: "My students had never seen a working humanoid up close. They have not stopped talking about it.", name: "Dr. Meera N.", role: "Faculty escort", place: "Engineering college" },
  { quote: "I came for the competitions and stayed for the conversations. The people here think differently.", name: "Priya T.", role: "Workshop participant", place: "Bangalore" },
  { quote: "Battle of Bands was the highlight of my Techfest. The crowd energy was unlike anything I have played before.", name: "Rohan D.", role: "Musician", place: "Delhi" }
];

TF.winners = [
  { year: "2024", event: "International Robotics Challenge", team: "Team Vortex", place: "IIT Kanpur" },
  { year: "2024", event: "Codestorm", team: "Nullpointer", place: "IIT Bombay" },
  { year: "2024", event: "Robowars (60kg)", team: "Dominator", place: "COEP Pune" },
  { year: "2024", event: "Aerostorm", team: "Icarus", place: "NIT Trichy" },
  { year: "2023", event: "International Robotics Challenge", team: "Rigbot", place: "IIT Delhi" },
  { year: "2023", event: "Codestorm", team: "Segmentation Fault", place: "BITS Pilani" },
  { year: "2023", event: "Robowars (15kg)", team: "Wedge", place: "IIT Kharagpur" },
  { year: "2022", event: "International Robotics Challenge", team: "Automatons", place: "IIT Madras" }
];

TF.partners = [
  { tier: "Title partner", names: ["Aetherly"] },
  { tier: "Powered by", names: ["Nova Systems", "Helios Labs"] },
  { tier: "Innovation partners", names: ["Lumen Robotics", "Orbit Aerospace", "Quantiq", "Neonworks"] },
  { tier: "Academic and outreach", names: ["IIT Bombay", "Techfest Outreach Network"] }
];

TF.faqs = [
  { q: "When and where is Techfest 2026?", a: "16–18 December 2026 at IIT Bombay, Powai, Mumbai. Campus gates open at 09:30 on all three days." },
  { q: "Is entry open to everyone?", a: "Yes. The festival is open to students, professionals and visitors. Registered participants get priority on competitive events and lecture seats." },
  { q: "How do I register?", a: "Use the Register page, pick a pathway — Student, Builder, Researcher, Startup or Visitor — and complete the form. Competitive events also require per-event team registration before the stated deadline." },
  { q: "Is there a fee to attend?", a: "General festival entry is free. Some workshops and competitive events carry a participation fee, listed on each event page." },
  { q: "Can outstation participants stay on campus?", a: "Hostel accommodation is offered to registered outstation participants on a first-come basis, at a nominal charge." },
  { q: "Are the events accessible?", a: "The festival targets WCAG AA for digital content and provides accessible routes and viewing zones at major venues. Contact us for specific accommodations." },
  { q: "How do I reach IIT Bombay?", a: "The campus is in Powai, reachable by metro to Saki Naka or Andheri, then road; by suburban rail to Kanjurmarg; and by air via Chhatrapati Shivaji Maharaj International Airport." },
  { q: "Will sessions be recorded?", a: "Selected lectures are streamed and recorded subject to speaker consent. Check the official channel closer to the festival." },
  { q: "Can I volunteer at Techfest?", a: "Yes — a volunteer drive opens in October. Volunteers get behind-the-scenes access, a certificate and festival merchandise. Watch the official channels for the application link." },
  { q: "Is there food on campus?", a: "Multiple food courts operate across the festival grounds, including the Lakeside Lawns food street, with options across cuisines and price ranges. Outside food is also permitted in designated areas." }
];

TF.visitorPlan = [
  { title: "Getting there", items: ["Metro to Saki Naka, then a short cab to the Main Gate", "Suburban rail to Kanjurmarg, then share-auto", "Airport: CSMIA, roughly 45 minutes by road", "Use the Powai campus Main Gate for visitor entry"] },
  { title: "Bring", items: ["Government photo ID for registration", "Reusable water bottle (refill stations on campus)", "Comfortable shoes — the campus is walkable but large", "A power bank; charging points are limited in arenas"] },
  { title: "Plan around", items: ["Peak hours 12:00–16:00 — arrive early for marquee talks", "Robowars finals on 18 December fill the arena fast", "Evenings shift outdoors for Technoholix — carry a layer", "Food courts at the Lakeside Lawns stay open late"] },
  { title: "Accessibility", items: ["Step-free routes connect all major venues", "Reserved viewing zones at the Robotics Arena and Open Air Theatre", "Sign-language interpretation available on request for marquee lectures", "Accessible restrooms at the Exhibition Hall and Workshop Labs"] }
];

/* ============================================================
   EXTENDED CONTENT MODEL (CMS-ready, structured)
   ============================================================ */

/* ---------- identity / contact / social ---------- */
TF.meta.social = [
  { label: "Instagram", handle: "@techfest.iitb", href: "https://instagram.com" },
  { label: "X / Twitter", handle: "@techfest", href: "https://x.com" },
  { label: "YouTube", handle: "Techfest IIT Bombay", href: "https://youtube.com" },
  { label: "LinkedIn", handle: "Techfest", href: "https://linkedin.com" }
];
TF.meta.contact = [
  { label: "Festival desk", email: "hello@techfest.org" },
  { label: "Partnerships", email: "partners@techfest.org" },
  { label: "Media", email: "media@techfest.org" }
];

/* ---------- event genomes: a distinct visual language per category ----------
   form drives the procedural canvas signature in js/genome.js. */
TF.genomes = {
  competitions:  { name: "Arena",        form: "grid",   accent: "#d4af78", line: "Brackets, eliminations, one clean run." },
  robowars:      { name: "Impact",       form: "gear",   accent: "#ff6a2b", line: "Torque, armour and contact." },
  workshops:     { name: "Studio",       form: "neural", accent: "#7ec8d8", line: "Hands on the bench, outcomes you keep." },
  lectures:      { name: "Signal",       form: "orbit",  accent: "#f0d9a8", line: "Ideas broadcast from the dais." },
  exhibitions:   { name: "Installation", form: "node",   accent: "#c9a6ff", line: "Technology you can walk around." },
  entertainment: { name: "Spectrum",     form: "beam",   accent: "#e06ad4", line: "Light, sound and crowd." }
};

/* ---------- participant interests (drives the planner) ---------- */
TF.interests = [
  { id: "ai",        label: "AI & Machine Learning", categories: ["workshops", "lectures", "exhibitions"], events: ["deeplearning", "genai", "lectures-machine", "expo-innovations"] },
  { id: "robotics",  label: "Robotics & Automation", categories: ["competitions", "robowars", "workshops"], events: ["irc", "robowars", "autonomous-robotics", "meshmerize", "hydraulics"] },
  { id: "space",     label: "Space & Aerospace",     categories: ["workshops", "lectures", "exhibitions"], events: ["cubesat", "aerostorm", "lectures-orbit", "expo-defence"] },
  { id: "coding",    label: "Coding & Algorithms",   categories: ["competitions", "workshops"], events: ["codestorm", "deeplearning", "genai", "cyberdefense"] },
  { id: "cyber",     label: "Cybersecurity",         categories: ["workshops", "lectures"], events: ["cyberdefense", "codestorm", "lectures-command"] },
  { id: "startup",   label: "Entrepreneurship",      categories: ["competitions", "exhibitions", "lectures"], events: ["ideate", "expo-innovations", "lectures-machine"] },
  { id: "mobility",  label: "Automotive & Mobility", categories: ["competitions"], events: ["fullthrottle", "aerostorm", "hydraulics"] },
  { id: "making",    label: "Design & Making",       categories: ["competitions", "workshops", "exhibitions"], events: ["ideate", "hydraulics", "dronebuilding", "expo-international"] },
  { id: "spectacle", label: "Shows & Night Life",    categories: ["entertainment"], events: ["technoholix", "lasershow", "gamingarena"] },
  { id: "quantum",   label: "Quantum & Frontier Tech", categories: ["lectures", "workshops"], events: ["lectures-quantum", "cubesat", "deeplearning"] },
  { id: "climate",   label: "Climate & Energy",      categories: ["lectures", "exhibitions"], events: ["lectures-climate", "expo-renewable", "expo-innovations"] },
  { id: "music",     label: "Music & Performance",   categories: ["entertainment"], events: ["battleofbands", "technoholix", "lasershow"] }
];

/* ---------- named lecture / workshop profiles ---------- */
TF.speakers = [
  { id: "sp-orbit", name: "Dr. Ananya Verma", role: "Mission scientist", org: "National space programme", topic: "Human spaceflight and the road to orbit", eventId: "lectures-orbit", img: "space.jpg", bio: "Works across launch, payload and human-spaceflight programmes, and speaks on translating research into flown hardware." },
  { id: "sp-command", name: "R. Menon", role: "Strategic leadership (Retd.)", org: "Defence technology", topic: "Technology, security and self-reliance", eventId: "lectures-command", img: "hall.jpg", bio: "A career across defence technology and acquisition, now speaking on how technology reshapes national capability." },
  { id: "sp-machine", name: "Prof. Kenji Sato", role: "Robotics researcher", org: "Embodied intelligence lab", topic: "From viral demos to useful machines", eventId: "lectures-machine", img: "machine.jpg", bio: "Researches humanoids, manipulation and locomotion, and the gap between a striking demo and a machine that generalises." },
  { id: "sp-signal", name: "To be revealed", role: "Marquee keynote", org: "Announced in November", topic: "The Signal lecture", eventId: "lectures-signal", img: "speaker.jpg", bio: "The Signal lecture is Techfest's headline keynote. The speaker is revealed in the weeks before December." },
  { id: "sp-genai", name: "Sara Lindqvist", role: "Applied AI engineer", org: "LLM systems", topic: "Retrieval systems that hold up in production", eventId: "genai", img: "code.jpg", bio: "Builds and evaluates large-language-model applications, with a focus on retrieval, evaluation and cost." },
  { id: "sp-robot", name: "Miguel Ferrer", role: "Robotics founder", org: "Autonomy startup", topic: "Autonomy beyond the lab", eventId: "autonomous-robotics", img: "robot.jpg", bio: "Founder working on perception and control, translating research autonomy into machines that ship." },
  { id: "sp-quantum", name: "Dr. Yuki Tanaka", role: "Quantum computing researcher", org: "Quantum systems lab", topic: "Qubits, error correction and the road to useful quantum machines", eventId: "lectures-quantum", img: "quantum.jpg", bio: "Researches superconducting qubits and error-correcting codes, and speaks on where quantum computing actually stands today." },
  { id: "sp-climate", name: "Dr. Amara Osei", role: "Clean energy engineer", org: "Grid-scale storage", topic: "Battery technology and the future of renewable grids", eventId: "lectures-climate", img: "climate.jpg", bio: "Works on grid-scale battery systems and renewable integration, with a focus on deployable clean-energy technology." }
];

/* ---------- exhibitions as physical installations ---------- */
TF.exhibitions = [
  { id: "ex-humanoid", title: "Humanoid Yard",     zone: "Robotics",             eventId: "expo-international", venue: "Exhibition Hall",  interactive: true,  blurb: "Walking humanoids and manipulators operating in a marshalled enclosure." },
  { id: "ex-neural",   title: "Neural Wall",       zone: "Artificial intelligence", eventId: "expo-innovations", venue: "Innovation Hangar", interactive: true,  blurb: "A wall-scale visualisation of a model attending to its input in real time." },
  { id: "ex-orbit",    title: "Orbital Gallery",   zone: "Space",                eventId: "expo-defence",       venue: "Exhibition Hall",  interactive: false, blurb: "Satellite buses, payloads and a full-scale small-sat mock-up." },
  { id: "ex-drive",    title: "Kinetic Drive",     zone: "Automotive",           eventId: "fullthrottle",       venue: "Main Grounds",     interactive: true,  blurb: "Electric drivetrains, telemetry and a cutaway racer on the floor." },
  { id: "ex-defence",  title: "Hardening Lab",     zone: "Defence",              eventId: "expo-defence",       venue: "Exhibition Hall",  interactive: false, blurb: "Materials, sensing and simulation under the hardest engineering constraints." },
  { id: "ex-emerging", title: "Emerging Tech Bench", zone: "Emerging technology", eventId: "expo-innovations",   venue: "Innovation Hangar", interactive: true,  blurb: "Research spinouts and student projects on a working bench." },
  { id: "ex-radar",    title: "Radar and EW Zone", zone: "Defence technology",   eventId: "expo-defence-pavilion", venue: "Exhibition Hall", interactive: true,  blurb: "Radar systems, electronic warfare displays and signal-processing demonstrations." },
  { id: "ex-solar",    title: "Solar Array Walk",  zone: "Renewable energy",     eventId: "expo-renewable",     venue: "Exhibition Hall",  interactive: true,  blurb: "Photovoltaic panels, inverters and a live generation dashboard." }
];

/* ---------- per-event depth: rules, timeline, outcomes, organisers ---------- */
TF.eventDetails = {
  irc: {
    organizer: "Techfest Robotics Team",
    rules: ["Teams of 3–6; one robot per team", "Robot must operate within the 50kg class", "Autonomy blackout phase: no operator input", "Safety inspection before every run", "Two runs; best valid score counts"],
    timeline: [{ t: "Registrations close", d: "10 Nov 2026" }, { t: "Zonals", d: "Oct–Nov 2026" }, { t: "Campus finale", d: "16–18 Dec 2026" }]
  },
  codestorm: {
    organizer: "Techfest Programming Committee",
    rules: ["Solo or pairs", "Online qualifiers, onsite finale", "Languages: C++, Java, Python, Rust", "Live scoreboard with a halfway freeze", "Plagiarism check on all submissions"],
    timeline: [{ t: "Qualifier round", d: "Online, Nov 2026" }, { t: "Finalist list", d: "28 Nov 2026" }, { t: "Live finale", d: "17 Dec 2026" }]
  },
  robowars: {
    organizer: "Techfest Robotics Team",
    rules: ["15kg and 60kg classes", "Three-minute bouts; knockout or judges' decision", "Banned: liquid weapons, untethered projectiles", "Burst-pressure and safety inspection mandatory", "Pit bays provided; spares not supplied"],
    timeline: [{ t: "Safety inspection", d: "18 Dec, 09:00" }, { t: "Group bouts", d: "18 Dec, 14:00" }, { t: "Grand final", d: "18 Dec, 20:00" }]
  },
  meshmerize: {
    organizer: "Techfest Robotics Team",
    rules: ["Fully autonomous; no operator input", "Max footprint 25cm × 25cm, max 2kg", "Track re-routed between rounds", "Millisecond timing gates", "Colour-inversion segment included"],
    timeline: [{ t: "Timed heats", d: "17 Dec, 10:00" }, { t: "Quarter-finals", d: "17 Dec, 14:00" }, { t: "Final sprint", d: "17 Dec, 16:00" }]
  },
  fullthrottle: {
    organizer: "Techfest Mobility Team",
    rules: ["RC machines only", "Max 22.2V LiPo; packs inspected and logged", "Circuit includes chicanes, airtime and a pit lane", "Mandatory pit stop in the final", "Telemetry inspected post-race"],
    timeline: [{ t: "Time trials", d: "18 Dec, 09:00" }, { t: "Semi-finals", d: "18 Dec, 11:00" }, { t: "Grand prix", d: "18 Dec, 13:00" }]
  },
  aerostorm: {
    organizer: "Techfest Aerospace Team",
    rules: ["Unmanned aerial systems only", "Autonomous waypoint missions", "Precision payload drop scored by accuracy", "GPS-denied segment in the final", "Flights inside a netted enclosure"],
    timeline: [{ t: "Qualifier flights", d: "17 Dec, 13:00" }, { t: "Mission rounds", d: "17 Dec, 15:00" }, { t: "Precision final", d: "17 Dec, 18:00" }]
  },
  ideate: {
    organizer: "Techfest Innovation Team",
    rules: ["Teams of 2–5, open to all", "Problem framing weighted heavily", "Mentorship for finalists", "On-campus pitch to founders and faculty", "Working prototype strengthens the entry"],
    timeline: [{ t: "Submission close", d: "22 Nov 2026" }, { t: "Mentorship sprint", d: "Dec 2026" }, { t: "Pitch finale", d: "16 Dec 2026" }]
  },
  hydraulics: {
    organizer: "Techfest Engineering Team",
    rules: ["Purely manual hydraulic control", "No electric actuation", "Lift, transport and place a payload", "Scored on precision, cycle time and build quality", "Qualifying run then final"],
    timeline: [{ t: "Qualifying run", d: "17 Dec, 14:00" }, { t: "Precision final", d: "17 Dec, 16:00" }]
  },
  bridgeblitz: {
    organizer: "Techfest Civil Engineering Team",
    rules: ["Balsa wood, PVA adhesive and string only", "Bridge must span a 40cm gap", "Maximum weight 500g", "Load-to-weight ratio is the primary score", "Design report submitted before build"],
    timeline: [{ t: "Design window", d: "17 Dec, 09:00" }, { t: "Build session", d: "17 Dec, 10:00" }, { t: "Load-testing finale", d: "17 Dec, 12:00" }]
  },
  aerodesign: {
    organizer: "Techfest Aerospace Team",
    rules: ["Maximum wingspan 2.5 metres", "Pre-flight technical inspection mandatory", "Missions: duration, payload, precision landing", "Design presentation judged", "Fly-off finale on the Main Grounds"],
    timeline: [{ t: "Design review", d: "17 Dec, 10:00" }, { t: "Technical inspection", d: "17 Dec, 14:00" }, { t: "Flight missions", d: "18 Dec, 10:00" }, { t: "Fly-off finale", d: "18 Dec, 15:00" }]
  },
  codesprint: {
    organizer: "Techfest Software Team",
    rules: ["Teams of 2–4", "All code written during the 24-hour window", "Working demo required for judging", "Cloud credits and API keys provided", "Mentors available throughout the night"],
    timeline: [{ t: "Kickoff", d: "17 Dec, 18:00" }, { t: "Build window", d: "17 Dec, 18:00 – 18 Dec, 18:00" }, { t: "Demos and judging", d: "18 Dec, 09:00" }]
  },
  deeplearning: {
    organizer: "Techfest Workshops Team",
    outcome: "Train and evaluate a convolutional and transformer model, then deploy a working inference endpoint.",
    timeline: [{ t: "Day 1", d: "Tensors → CNNs" }, { t: "Day 2", d: "Transformers → deployment" }]
  },
  "autonomous-robotics": {
    organizer: "Techfest Robotics Labs",
    outcome: "Assemble a ROS 2 autonomy stack — sensor fusion, SLAM and planning — and transfer it to a physical testbot.",
    timeline: [{ t: "Day 1", d: "ROS 2, fusion, SLAM" }, { t: "Day 2", d: "Planning, control, testbot" }]
  },
  cubesat: {
    organizer: "Techfest Space Systems Team",
    outcome: "Design a CubeSat mission and defend it in a mini design review covering power, attitude and link budgets.",
    timeline: [{ t: "Modules 1–3", d: "Mission, power, ADCS" }, { t: "Module 4–5", d: "Comms, design review" }]
  },
  genai: {
    organizer: "Techfest AI Team",
    outcome: "Ship a retrieval-augmented application and leave with an evaluation harness and guardrails.",
    timeline: [{ t: "Morning", d: "Embeddings, retrieval" }, { t: "Afternoon", d: "Build, evaluate, ship" }]
  },
  dronebuilding: {
    organizer: "Techfest UAV Labs",
    outcome: "Build, tune and fly a quadcopter in a supervised enclosure — and keep the kit.",
    timeline: [{ t: "Build", d: "Frame, power, radio" }, { t: "Fly", d: "PID tuning, flight" }]
  },
  cyberdefense: {
    organizer: "Techfest Security Team",
    outcome: "Threat-model a system, harden it, build detection and practise an incident-response playbook in an isolated lab.",
    timeline: [{ t: "Track A", d: "Threat modelling, hardening" }, { t: "Track B", d: "Detection, response" }]
  },
  arduinoworkshop: {
    organizer: "Techfest Embedded Systems Team",
    outcome: "Build a working embedded product combining sensors, actuators and real-time control on an Arduino platform.",
    timeline: [{ t: "Day 1", d: "GPIO, ADC, PWM, sensors" }, { t: "Day 2", d: "Serial, interrupts, capstone" }]
  },
  printing3d: {
    organizer: "Techfest Prototyping Lab",
    outcome: "Design a part in CAD, prepare it for additive manufacturing, print it and take it home.",
    timeline: [{ t: "Morning", d: "CAD and design for AM" }, { t: "Afternoon", d: "Slicing, printing, post-processing" }]
  },
  "lectures-orbit": { organizer: "Techfest Lectures Team", rules: ["Seat reservation recommended", "Moderated Q&A follows", "Live-streamed to overflow halls"] },
  "lectures-command": { organizer: "Techfest Lectures Team", rules: ["Seat reservation recommended", "Student-first Q&A", "Recording follows the official media policy"] },
  "lectures-machine": { organizer: "Techfest Lectures Team", rules: ["Seat reservation recommended", "Panel follows the keynote", "Demos in the adjacent exhibition hall"] },
  "lectures-signal": { organizer: "Techfest Lectures Team", rules: ["Seat reservation recommended", "Speaker revealed in November", "This hall fills first"] },
  "lectures-quantum": { organizer: "Techfest Lectures Team", rules: ["Seat reservation recommended", "Live quantum circuit demo", "Q&A follows the talk"] },
  "lectures-climate": { organizer: "Techfest Lectures Team", rules: ["Seat reservation recommended", "Panel follows the keynote", "Audience discussion included"] },
  "expo-international": { organizer: "Techfest Exhibitions Team", rules: ["Open walkthrough", "Some zones are supervised for interaction", "Display-only exhibits are marked"] },
  "expo-innovations": { organizer: "Techfest Exhibitions Team", rules: ["Exhibit application required before 20 Nov", "Bench, power and a demo slot provided", "Investor and recruiter floor"] },
  "expo-defence": { organizer: "Techfest Exhibitions Team", rules: ["Registration at entry", "Some exhibits are display-only", "Daily technical floor talks"] },
  "expo-defence-pavilion": { organizer: "Techfest Exhibitions Team", rules: ["Registration at entry", "Scheduled demonstrations every two hours", "Some exhibits are display-only"] },
  "expo-renewable": { organizer: "Techfest Exhibitions Team", rules: ["Open walkthrough", "Live data dashboards", "Smart-grid simulator is interactive"] },
  technoholix: { organizer: "Techfest Cultural Team", rules: ["Included with the festival pass", "Day passes are limited", "Outdoor; carry a layer"] },
  lasershow: { organizer: "Techfest Cultural Team", rules: ["Free to attend", "Best view from the Main Grounds lawns", "Synchronised audio broadcast"] },
  gamingarena: { organizer: "Techfest Gaming Team", rules: ["Free-play floor open all day", "Tournaments require a bracket slot", "Bracket rules posted at the stage"] },
  battleofbands: { organizer: "Techfest Cultural Team", rules: ["Original material required for at least two songs", "Standard backline provided", "Registration required before 05 Dec"] }
};

/* merge detail fields onto events without restructuring the array */
(TF.events || []).forEach((e) => { Object.assign(e, TF.eventDetails[e.id] || {}); });

/* ---------- festival route templates for the planner ---------- */
TF.routes = {
  student:     { name: "Student route",   blurb: "Balance arenas, workshops and the marquee lectures across all three days." },
  builder:     { name: "Builder route",   blurb: "Spend your hours where things move — arenas, robot pits and build labs." },
  researcher:  { name: "Researcher route", blurb: "Prioritise the dais, deep-tech pavilions and frontier workshops." },
  startup:     { name: "Startup route",   blurb: "Split time between the pitch floor, the expo and conversations that hire." },
  visitor:     { name: "Visitor route",   blurb: "The spectacle first: arenas, exhibitions and every night programme." }
};
