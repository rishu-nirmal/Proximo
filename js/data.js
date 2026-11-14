/**
 * Proximo - Academic Data Store & Curriculum Presets
 * Supports user onboarding for any year, semester, and branch at SRM AP.
 */

const CURRICULUM_PRESETS = {
  // Year 1 (Foundation for all engineering branches)
  year_1: [
    {
      id: "ma101",
      code: "MA101",
      name: "Engineering Calculus & Linear Algebra",
      credits: 4,
      color: "#10B981",
      bgLight: "rgba(16, 185, 129, 0.12)",
      icon: "sigma",
      faculty: "Dr. K. Ramanathan",
      targetWeeklyHours: 7.0,
      units: ["Limits & Continuity", "Differential Calculus", "Matrices & Eigenvalues", "Vector Spaces", "Multiple Integrals"],
      sampleTasks: [
        { title: "Eigenvalues & Diagonalization Assignment", type: "assignment", priority: "urgent", estMin: 90, daysAhead: 1 }
      ]
    },
    {
      id: "ph101",
      code: "PH101",
      name: "Physics for Computing Engineers",
      credits: 4,
      color: "#06B6D4",
      bgLight: "rgba(6, 182, 212, 0.12)",
      icon: "atom",
      faculty: "Dr. Sudheer Reddy",
      targetWeeklyHours: 7.0,
      units: ["Quantum Mechanics", "Semiconductor Physics", "Fiber Optics & Lasers", "Electromagnetic Theory", "Nanomaterials"],
      sampleTasks: [
        { title: "Quantum Tunneling & Schrödinger Problem Set", type: "assignment", priority: "high", estMin: 75, daysAhead: 3 }
      ]
    },
    {
      id: "cs101",
      code: "CS101",
      name: "Problem Solving & Python Programming",
      credits: 4,
      color: "#6366F1",
      bgLight: "rgba(99, 102, 241, 0.12)",
      icon: "code",
      faculty: "Prof. Ananya Sen",
      targetWeeklyHours: 8.0,
      units: ["Python Basics & Control Flow", "Functions & Recursion", "Data Structures (Lists, Dicts, Tuples)", "File I/O & Exceptions", "OOP Basics"],
      sampleTasks: [
        { title: "Python Mini-Project: Student Grade Analyzer", type: "project", priority: "high", estMin: 120, daysAhead: 2 }
      ]
    },
    {
      id: "ee101",
      code: "EE101",
      name: "Basic Electrical & Electronics",
      credits: 3,
      color: "#F59E0B",
      bgLight: "rgba(245, 158, 11, 0.12)",
      icon: "zap",
      faculty: "Dr. B. Prasad",
      targetWeeklyHours: 5.0,
      units: ["DC & AC Circuit Analysis", "Semiconductor Diodes", "Transistors & BJT", "Operational Amplifiers", "Digital Logic Gates"],
      sampleTasks: [
        { title: "Thevenin & Norton Equivalent Circuits Lab Record", type: "lab_record", priority: "medium", estMin: 60, daysAhead: 4 }
      ]
    },
    {
      id: "cs101l",
      code: "CS101L",
      name: "Python Computing & Problem Solving Lab",
      credits: 2,
      color: "#8B5CF6",
      bgLight: "rgba(139, 92, 246, 0.12)",
      icon: "flask-conical",
      faculty: "Prof. Ananya Sen",
      targetWeeklyHours: 4.0,
      units: ["Basic Syntax & Loops", "Data Structures Experiments", "File Parsing & Regular Expressions", "GUI with Tkinter"],
      sampleTasks: [
        { title: "Lab Record 5: Matrix Multiplication & Text Scraper", type: "lab_record", priority: "medium", estMin: 60, daysAhead: 5 }
      ]
    }
  ],

  // Year 2 (Core Computer Science Fundamentals)
  year_2: [
    {
      id: "cs201",
      code: "CS201",
      name: "Data Structures & Algorithms",
      credits: 4,
      color: "#6366F1",
      bgLight: "rgba(99, 102, 241, 0.12)",
      icon: "network",
      faculty: "Dr. Anirban Ghosh",
      targetWeeklyHours: 8.0,
      units: ["Arrays, Stacks & Queues", "Linked Lists & Binary Trees", "Binary Search Trees & AVL", "Hashing & Heaps", "Graph Traversals (BFS/DFS)"],
      sampleTasks: [
        { title: "AVL Tree Balancing & Rotations Implementation", type: "assignment", priority: "urgent", estMin: 110, daysAhead: 1 }
      ]
    },
    {
      id: "ma201",
      code: "MA201",
      name: "Discrete Mathematics & Graph Theory",
      credits: 4,
      color: "#10B981",
      bgLight: "rgba(16, 185, 129, 0.12)",
      icon: "sigma",
      faculty: "Dr. Lakshmi Narayanan",
      targetWeeklyHours: 7.0,
      units: ["Propositional Logic & Proofs", "Set Theory & Relations", "Combinatorics & Recurrences", "Graph Theory & Trees", "Algebraic Structures"],
      sampleTasks: [
        { title: "Mathematical Induction & Recurrence Relations Sheet", type: "assignment", priority: "high", estMin: 80, daysAhead: 3 }
      ]
    },
    {
      id: "cs202",
      code: "CS202",
      name: "Object-Oriented Programming with Java",
      credits: 4,
      color: "#EC4899",
      bgLight: "rgba(236, 72, 153, 0.12)",
      icon: "code",
      faculty: "Dr. Priyanka Roy",
      targetWeeklyHours: 7.0,
      units: ["Java Fundamentals & OOP Concepts", "Inheritance & Polymorphism", "Interfaces & Abstract Classes", "Exception Handling & Collections", "Multithreading & Streams"],
      sampleTasks: [
        { title: "Bank Management System using Java Collections", type: "project", priority: "high", estMin: 120, daysAhead: 2 }
      ]
    },
    {
      id: "cs203",
      code: "CS203",
      name: "Computer Organization & Architecture",
      credits: 3,
      color: "#06B6D4",
      bgLight: "rgba(6, 182, 212, 0.12)",
      icon: "cpu",
      faculty: "Prof. S. R. Venkat",
      targetWeeklyHours: 6.0,
      units: ["Instruction Set Architecture (MIPS)", "Arithmetic Logic Unit", "Pipelining & Hazards", "Memory Hierarchy & Cache", "I/O Organization"],
      sampleTasks: [
        { title: "Cache Mapping & Pipelining Hazards Quiz Prep", type: "quiz", priority: "medium", estMin: 60, daysAhead: 4 }
      ]
    },
    {
      id: "cs204",
      code: "CS204",
      name: "Digital Systems Design",
      credits: 3,
      color: "#F59E0B",
      bgLight: "rgba(245, 158, 11, 0.12)",
      icon: "microchip",
      faculty: "Dr. B. Prasad",
      targetWeeklyHours: 5.0,
      units: ["Boolean Algebra & K-Maps", "Combinational Circuits", "Sequential Circuits & Flip-Flops", "Registers & Counters", "Verilog HDL Basics"],
      sampleTasks: [
        { title: "Finite State Machine & Verilog Simulation Record", type: "lab_record", priority: "medium", estMin: 75, daysAhead: 5 }
      ]
    },
    {
      id: "cs201l",
      code: "CS201L",
      name: "Data Structures & Java Programming Lab",
      credits: 2,
      color: "#8B5CF6",
      bgLight: "rgba(139, 92, 246, 0.12)",
      icon: "flask-conical",
      faculty: "Dr. Anirban Ghosh",
      targetWeeklyHours: 4.0,
      units: ["Stacks & Queues in Java", "BST & Heap Sort Lab", "Graph Algorithms Lab", "Java GUI Mini-App"],
      sampleTasks: [
        { title: "Lab Observation 6: Dijkstra Shortest Path in Java", type: "lab_record", priority: "medium", estMin: 60, daysAhead: 6 }
      ]
    }
  ],

  // Year 3 (Specializations: AI/ML, Core, Data Science, etc.)
  year_3_aiml: [
    {
      id: "ml",
      code: "CS301",
      name: "Machine Learning & Deep Learning",
      credits: 4,
      color: "#6366F1",
      bgLight: "rgba(99, 102, 241, 0.12)",
      icon: "brain-circuit",
      faculty: "Dr. K. Sreenivasa Rao",
      targetWeeklyHours: 8.0,
      units: ["Supervised Learning & Regression", "Decision Trees, SVM & Ensembles", "Neural Networks & Backprop Math", "Deep CNNs & Transformers", "Unsupervised & Clustering"],
      sampleTasks: [
        { title: "Fine-tuning ResNet-50 on CIFAR-100", type: "project", priority: "high", estMin: 180, daysAhead: 2 },
        { title: "Backpropagation Mathematical Derivation", type: "exam_prep", priority: "urgent", estMin: 60, daysAhead: 0 }
      ]
    },
    {
      id: "dbms",
      code: "CS302",
      name: "Database Management Systems",
      credits: 4,
      color: "#EC4899",
      bgLight: "rgba(236, 72, 153, 0.12)",
      icon: "database",
      faculty: "Dr. Priyanka Roy",
      targetWeeklyHours: 7.0,
      units: ["ER Modeling & Relational Algebra", "Advanced SQL & Complex Queries", "Normalization (1NF to BCNF)", "Indexing, B+ Trees & Query Optimizer", "Transactions, Concurrency & ACID"],
      sampleTasks: [
        { title: "B+ Trees & Query Optimization Assignment", type: "assignment", priority: "urgent", estMin: 90, daysAhead: 1 },
        { title: "SQL Normalization Problem Set", type: "assignment", priority: "urgent", estMin: 90, daysAhead: -1 } // Overdue sample
      ]
    },
    {
      id: "os",
      code: "CS303",
      name: "Operating Systems",
      credits: 4,
      color: "#06B6D4",
      bgLight: "rgba(6, 182, 212, 0.12)",
      icon: "cpu",
      faculty: "Prof. S. R. Venkat",
      targetWeeklyHours: 7.0,
      units: ["OS Structures & Syscalls", "Process Scheduling & IPC", "Synchronization & Deadlocks", "Memory Management & Paging", "File Systems & Storage"],
      sampleTasks: [
        { title: "Multithreading & Banker's Algorithm Lab Record", type: "lab_record", priority: "high", estMin: 120, daysAhead: 2 }
      ]
    },
    {
      id: "daa",
      code: "CS304",
      name: "Design & Analysis of Algorithms",
      credits: 4,
      color: "#F59E0B",
      bgLight: "rgba(245, 158, 11, 0.12)",
      icon: "network",
      faculty: "Dr. Anirban Ghosh",
      targetWeeklyHours: 6.0,
      units: ["Asymptotic Notations & Recurrences", "Divide & Conquer, Greedy Strategies", "Dynamic Programming (Knapsack, LCS)", "Graph Algorithms & Network Flow", "NP-Completeness"],
      sampleTasks: [
        { title: "Bellman-Ford & Floyd-Warshall DP Practice", type: "reading", priority: "medium", estMin: 75, daysAhead: 3 }
      ]
    },
    {
      id: "math",
      code: "MA301",
      name: "Probability, Stats & Optimization",
      credits: 3,
      color: "#10B981",
      bgLight: "rgba(16, 185, 129, 0.12)",
      icon: "sigma",
      faculty: "Dr. Lakshmi Narayanan",
      targetWeeklyHours: 5.0,
      units: ["Random Variables & Distributions", "Markov Chains & Stationary Probs", "Convex Optimization & Gradient Descent", "Hypothesis Testing & ANOVA"],
      sampleTasks: [
        { title: "Markov Chains & Stationary Probs Quiz Prep", type: "quiz", priority: "medium", estMin: 80, daysAhead: 4 }
      ]
    },
    {
      id: "lab",
      code: "CS305L",
      name: "AI/ML Application Lab",
      credits: 2,
      color: "#8B5CF6",
      bgLight: "rgba(139, 92, 246, 0.12)",
      icon: "flask-conical",
      faculty: "Dr. K. Sreenivasa Rao",
      targetWeeklyHours: 4.0,
      units: ["Scikit-Learn Pipelines & EDA", "PyTorch Custom Tensors & Autograd", "CNN Vision Transfer Learning", "Capstone Project Deployment"],
      sampleTasks: [
        { title: "YOLOv8 Real-Time Detection Web Demo", type: "project", priority: "high", estMin: 150, daysAhead: 5 }
      ]
    }
  ],

  // Year 3 (CSE Core)
  year_3_core: [
    {
      id: "dbms",
      code: "CS302",
      name: "Database Management Systems",
      credits: 4,
      color: "#EC4899",
      bgLight: "rgba(236, 72, 153, 0.12)",
      icon: "database",
      faculty: "Dr. Priyanka Roy",
      targetWeeklyHours: 7.0,
      units: ["Relational Model & Algebra", "Advanced SQL & Joins", "Normalization Theory", "Indexing & Transactions", "NoSQL Foundations"],
      sampleTasks: [
        { title: "Relational Algebra Queries & Triggers Submission", type: "assignment", priority: "urgent", estMin: 90, daysAhead: 1 }
      ]
    },
    {
      id: "os",
      code: "CS303",
      name: "Operating Systems",
      credits: 4,
      color: "#06B6D4",
      bgLight: "rgba(6, 182, 212, 0.12)",
      icon: "cpu",
      faculty: "Prof. S. R. Venkat",
      targetWeeklyHours: 7.0,
      units: ["Kernel Architecture", "Process Synchronization", "Deadlock Prevention", "Virtual Memory & Paging", "Disk Scheduling"],
      sampleTasks: [
        { title: "Pthread Producer-Consumer Lab Submission", type: "lab_record", priority: "high", estMin: 100, daysAhead: 2 }
      ]
    },
    {
      id: "cn",
      code: "CS305",
      name: "Computer Networks",
      credits: 4,
      color: "#3B82F6",
      bgLight: "rgba(59, 130, 246, 0.12)",
      icon: "wifi",
      faculty: "Dr. M. S. Kumar",
      targetWeeklyHours: 7.0,
      units: ["OSI & TCP/IP Layering", "Data Link & Sliding Window", "IP Addressing, Subnetting & Routing", "TCP Congestion Control", "Application Layer (DNS, HTTP)"],
      sampleTasks: [
        { title: "Wireshark Packet Analysis & Subnetting Sheet", type: "assignment", priority: "high", estMin: 90, daysAhead: 3 }
      ]
    },
    {
      id: "toc",
      code: "CS306",
      name: "Theory of Computation & Automata",
      credits: 4,
      color: "#8B5CF6",
      bgLight: "rgba(139, 92, 246, 0.12)",
      icon: "network",
      faculty: "Dr. Sudheer Reddy",
      targetWeeklyHours: 6.0,
      units: ["DFA & NFA Equivalence", "Regular Expressions & Pumping Lemma", "Context-Free Grammars & Pushdown Automata", "Turing Machines", "Decidability & Halting Problem"],
      sampleTasks: [
        { title: "DFA Minimization & Pumping Lemma Proofs", type: "quiz", priority: "medium", estMin: 75, daysAhead: 4 }
      ]
    },
    {
      id: "web",
      code: "CS307",
      name: "Web Technologies & Full Stack Development",
      credits: 3,
      color: "#10B981",
      bgLight: "rgba(16, 185, 129, 0.12)",
      icon: "globe",
      faculty: "Prof. Ananya Sen",
      targetWeeklyHours: 5.0,
      units: ["HTML5, CSS3 & Responsive Design", "JavaScript ES6+ & DOM", "Node.js & Express REST APIs", "React Components & State", "MongoDB Integration"],
      sampleTasks: [
        { title: "MERN Stack E-Commerce API Prototype", type: "project", priority: "high", estMin: 120, daysAhead: 5 }
      ]
    },
    {
      id: "netlab",
      code: "CS305L",
      name: "Networks & Operating Systems Lab",
      credits: 2,
      color: "#F59E0B",
      bgLight: "rgba(245, 158, 11, 0.12)",
      icon: "flask-conical",
      faculty: "Prof. S. R. Venkat",
      targetWeeklyHours: 4.0,
      units: ["Socket Programming in C", "Routing Simulations (Cisco Packet Tracer)", "Process Scheduling Simulators", "Memory Allocation Algorithms"],
      sampleTasks: [
        { title: "TCP Socket Chat Application Lab Signoff", type: "lab_record", priority: "medium", estMin: 60, daysAhead: 6 }
      ]
    }
  ],

  // Year 4 (Advanced Electives & Capstone)
  year_4: [
    {
      id: "nlp",
      code: "CS401",
      name: "Natural Language Processing & LLMs",
      credits: 4,
      color: "#6366F1",
      bgLight: "rgba(99, 102, 241, 0.12)",
      icon: "message-square",
      faculty: "Dr. K. Sreenivasa Rao",
      targetWeeklyHours: 8.0,
      units: ["Text Preprocessing & Tokenization", "Word2Vec, GloVe & FastText", "Seq2Seq Models & Attention", "Transformers (BERT, GPT)", "Prompt Engineering & RAG"],
      sampleTasks: [
        { title: "Fine-tune LoRA Adapter for Domain Q&A", type: "project", priority: "urgent", estMin: 150, daysAhead: 2 }
      ]
    },
    {
      id: "cloud",
      code: "CS402",
      name: "Cloud Computing & Distributed Systems",
      credits: 4,
      color: "#06B6D4",
      bgLight: "rgba(6, 182, 212, 0.12)",
      icon: "cloud",
      faculty: "Dr. Ananya Sen",
      targetWeeklyHours: 7.0,
      units: ["Virtualization & Containers (Docker, K8s)", "AWS / GCP Core Services", "Serverless Architecture", "Distributed Consensus (Raft, Paxos)", "Cloud Security"],
      sampleTasks: [
        { title: "Kubernetes Cluster Deployment Assignment", type: "assignment", priority: "high", estMin: 90, daysAhead: 3 }
      ]
    },
    {
      id: "capstone",
      code: "CS499",
      name: "Capstone Major Project - Phase 1",
      credits: 6,
      color: "#8B5CF6",
      bgLight: "rgba(139, 92, 246, 0.12)",
      icon: "rocket",
      faculty: "Department Project Committee",
      targetWeeklyHours: 10.0,
      units: ["Problem Statement & Literature Survey", "System Architecture & Design", "Baseline Model Implementation", "Mid-term Evaluation Review"],
      sampleTasks: [
        { title: "Literature Survey Paper Submission", type: "project", priority: "urgent", estMin: 180, daysAhead: 1 }
      ]
    },
    {
      id: "security",
      code: "CS403",
      name: "Cyber Security & Cryptography",
      credits: 3,
      color: "#EC4899",
      bgLight: "rgba(236, 72, 153, 0.12)",
      icon: "shield",
      faculty: "Dr. Sudheer Reddy",
      targetWeeklyHours: 6.0,
      units: ["Classical Encryption & Number Theory", "Symmetric Ciphers (AES)", "Asymmetric Encryption (RSA, ECC)", "Hashes & Digital Signatures", "Network Penetration Testing"],
      sampleTasks: [
        { title: "RSA Key Generation & Attack Vectors Quiz", type: "quiz", priority: "medium", estMin: 70, daysAhead: 4 }
      ]
    }
  ]
};

// Storage keys
const STORAGE_KEY = "proximo_data_v2";
const ONBOARDING_KEY = "proximo_onboarding_completed";

/**
 * Creates personalized academic data based on user setup inputs
 */
function createPersonalizedDataset(userInput, selectedSubjects) {
  const name = userInput.name.trim() || "Student";
  const regNo = (userInput.regNo || "").trim().toUpperCase() || "AP23110010452";
  const branchName = userInput.branchName || "BTech CSE (AI & ML)";
  const yearName = userInput.yearName || "3rd Year";
  const semName = userInput.semName || "Semester 5 (Monsoon 2026)";
  const weeklyGoal = parseInt(userInput.weeklyGoalHours, 10) || 28;

  // Initials for avatar
  const initials = name
    .split(" ")
    .filter(Boolean)
    .map(p => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "SO";

  // Build Subjects list with syllabus units
  const subjects = selectedSubjects.map((s, idx) => {
    // Generate units if not present
    let syllabusUnits = [];
    if (s.units && Array.isArray(s.units)) {
      syllabusUnits = s.units.map((uName, uIdx) => ({
        name: `Unit ${uIdx + 1}: ${uName}`,
        completed: uIdx === 0 ? 90 : (uIdx === 1 ? 65 : (uIdx === 2 ? 35 : 10))
      }));
    } else {
      syllabusUnits = [
        { name: "Unit 1: Foundations & Core Principles", completed: 85 },
        { name: "Unit 2: Theoretical Models & Methods", completed: 60 },
        { name: "Unit 3: Intermediate Problem Solving", completed: 35 },
        { name: "Unit 4: Advanced Systems & Architecture", completed: 15 },
        { name: "Unit 5: Applications & Case Studies", completed: 0 }
      ];
    }

    // Calibrate initial logged hours to create an active realistic balance scenario:
    // First subject has slightly higher hours, a middle subject has very low hours (neglected),
    // and others are moderate.
    let hoursLogged = 3.0;
    if (idx === 0) {
      hoursLogged = Number((s.targetWeeklyHours * 1.5).toFixed(1)); // Over-focused course
    } else if (idx === 1) {
      hoursLogged = Number((s.targetWeeklyHours * 0.25).toFixed(1)); // Neglected course
    } else {
      hoursLogged = Number((s.targetWeeklyHours * 0.75).toFixed(1));
    }

    // Override if user explicitly picked priority subject
    if (s.id === userInput.prioritySubjectId) {
      hoursLogged = Number((s.targetWeeklyHours * 0.2).toFixed(1)); // Intentionally neglected so it gets recommended!
    }

    return {
      id: s.id || `subj-${idx + 1}`,
      code: s.code || `CS${300 + idx}`,
      name: s.name,
      color: s.color || "#6366F1",
      bgLight: s.bgLight || "rgba(99, 102, 241, 0.12)",
      icon: s.icon || "book-open",
      credits: s.credits || 4,
      faculty: s.faculty || "SRM AP Faculty",
      attendance: 90,
      targetGrade: "A",
      targetWeeklyHours: s.targetWeeklyHours || 6.0,
      hoursLoggedWeek: hoursLogged,
      syllabusUnits: syllabusUnits
    };
  });

  // Generate initial tasks based on subjects
  const now = new Date();
  const tasks = [];
  let taskIdCounter = 1;

  subjects.forEach(s => {
    // Find preset template if available
    const originalPreset = (selectedSubjects.find(os => os.id === s.id) || {});
    if (originalPreset.sampleTasks && originalPreset.sampleTasks.length > 0) {
      originalPreset.sampleTasks.forEach(st => {
        const d = new Date(now);
        d.setDate(d.getDate() + (st.daysAhead || 2));
        d.setHours(18, 0, 0, 0);

        const isOverdue = st.daysAhead < 0;

        tasks.push({
          id: `task-${taskIdCounter++}`,
          title: st.title,
          subjectId: s.id,
          type: st.type || "assignment",
          deadline: d.toISOString(),
          priority: st.priority || "high",
          estimatedMin: st.estMin || 60,
          progress: isOverdue ? 40 : (st.daysAhead === 0 ? 80 : 25),
          status: isOverdue ? "overdue" : "in_progress",
          notes: `Assigned for ${s.code} at SRM AP. Check course syllabus guidelines.`,
          subtasks: [
            { id: `st-${taskIdCounter}-1`, text: "Review lecture notes & formulation", done: true },
            { id: `st-${taskIdCounter}-2`, text: "Complete core implementation / derivations", done: isOverdue },
            { id: `st-${taskIdCounter}-3`, text: "Verify results and submit to faculty", done: false }
          ]
        });
      });
    } else {
      // Default task for custom subjects
      const d = new Date(now);
      d.setDate(d.getDate() + 2);
      d.setHours(20, 0, 0, 0);

      tasks.push({
        id: `task-${taskIdCounter++}`,
        title: `${s.code}: Unit 2 Assignment & Problem Set`,
        subjectId: s.id,
        type: "assignment",
        deadline: d.toISOString(),
        priority: "high",
        estimatedMin: 75,
        progress: 30,
        status: "in_progress",
        notes: `Weekly problem set for ${s.name}.`,
        subtasks: [
          { id: `st-${taskIdCounter}-1`, text: "Solve practice problems Q1-Q4", done: true },
          { id: `st-${taskIdCounter}-2`, text: "Prepare solution PDF for submission", done: false }
        ]
      });
    }
  });

  // Upcoming Exams
  const examDate1 = new Date(now);
  examDate1.setDate(examDate1.getDate() + 12);
  const examDate2 = new Date(now);
  examDate2.setDate(examDate2.getDate() + 24);

  const exams = [
    {
      id: "exam-1",
      title: `SRM AP CLA-2 / Mid-Semester Examinations`,
      date: examDate1.toISOString().slice(0, 10) + "T09:30:00",
      room: "ALC Block 304",
      weight: "25% Continuous Assessment",
      subjects: subjects.slice(0, 3).map(s => s.id)
    },
    {
      id: "exam-2",
      title: `End-Semester University Examinations`,
      date: examDate2.toISOString().slice(0, 10) + "T09:30:00",
      room: "Main Examination Hall A",
      weight: "50% Final Weightage",
      subjects: subjects.map(s => s.id)
    }
  ];

  // Daily effort log
  const dailyEffortLog = [
    { date: "2026-11-08", day: "Sun", hours: 3.0, breakdown: {} },
    { date: "2026-11-09", day: "Mon", hours: 4.5, breakdown: {} },
    { date: "2026-11-10", day: "Tue", hours: 4.0, breakdown: {} },
    { date: "2026-11-11", day: "Wed", hours: 3.5, breakdown: {} },
    { date: "2026-11-12", day: "Thu", hours: 5.0, breakdown: {} },
    { date: "2026-11-13", day: "Fri", hours: 4.0, breakdown: {} },
    { date: "2026-11-14", day: "Sat (Today)", hours: 3.5, breakdown: {} }
  ];

  // Seed breakdown for today
  if (subjects.length > 0) {
    dailyEffortLog[6].breakdown[subjects[0].id] = 2.0;
    if (subjects.length > 1) {
      dailyEffortLog[6].breakdown[subjects[1].id] = 1.5;
    }
  }

  // Notifications
  const notifications = [
    {
      id: "notif-welcome",
      title: `Welcome to Proximo, ${name.split(" ")[0]}! 🚀`,
      message: `Your academic companion for ${semName} (${branchName}) is now configured with your ${subjects.length} courses.`,
      type: "info",
      time: "Just now",
      read: false
    },
    {
      id: "notif-balance",
      title: "Balanced-Focus Meter Active ⚖️",
      message: "Keep an eye on your weekly balance score so none of your courses fall behind.",
      type: "warning",
      time: "Just now",
      read: false
    }
  ];

  const profile = {
    name: name,
    role: branchName,
    university: userInput.university || "SRM University - AP, Amaravati",
    regNo: regNo,
    year: yearName,
    semester: semName,
    avatar: initials,
    level: 1,
    levelTitle: "Orbital Initiate",
    xp: 50,
    nextLevelXp: 300,
    streak: 1,
    weeklyGoalHours: weeklyGoal,
    semesterStart: "2026-08-01",
    semesterEnd: "2026-12-20",
    theme: "dark",
    onboarded: true
  };

  const badges = [
    {
      id: "first-orbit",
      name: "First Orbit",
      desc: "Completed your academic profile setup",
      icon: "🚀",
      unlocked: true,
      unlockedDate: "Today"
    },
    {
      id: "streak-7",
      name: "7-Day Comet",
      desc: "Maintained a 7-day study streak",
      icon: "🔥",
      unlocked: false,
      progress: 14
    },
    {
      id: "balance-guru",
      name: "Zenith of Balance",
      desc: "Reach a weekly Balance Score of 85 or above",
      icon: "⚖️",
      unlocked: false,
      progress: 60
    },
    {
      id: "srm-scholar",
      name: "AP Distinction",
      desc: "Complete 10 assignments ahead of deadline",
      icon: "🏆",
      unlocked: false,
      progress: 20
    }
  ];

  return {
    profile,
    subjects,
    tasks,
    exams,
    badges,
    dailyEffortLog,
    notifications,
    reminderSettings: {
      notifyOneDay: true,
      notifyThreeHours: true,
      notifyThirtyMin: true,
      morningSummary: true,
      morningSummaryTime: "08:00",
      neglectedNudges: true
    }
  };
}

function hasCompletedOnboarding() {
  try {
    return localStorage.getItem(ONBOARDING_KEY) === "true";
  } catch (e) {
    return false;
  }
}

function markOnboardingComplete() {
  try {
    localStorage.setItem(ONBOARDING_KEY, "true");
  } catch (e) {}
}

function resetOnboarding() {
  try {
    localStorage.removeItem(ONBOARDING_KEY);
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {}
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.profile && parsed.subjects && parsed.tasks) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn("Error loading stored data:", e);
  }
  return null;
}

function saveData(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save data:", e);
  }
}
