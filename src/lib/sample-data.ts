import {
  Course,
  DocumentChunk,
  QuizQuestion,
  TopicNode,
  UploadedDocument,
  TeacherSubjectClass,
  StudentPerformanceRecord
} from '@/types';

// ==========================================================
// 1. CHUNKS (Operating Systems, Database Systems, Machine Learning)
// ==========================================================
export const SAMPLE_CHUNKS: DocumentChunk[] = [
  // --- CS201: Operating Systems Chunks ---
  {
    id: 'chk-os-101',
    docId: 'doc-tb-1',
    docTitle: 'Operating Systems Principles (8th Ed) - Silberschatz & Galvin',
    docType: 'textbook',
    section: 'Chapter 5.3: CPU Scheduling Algorithms',
    text: `CPU scheduling deals with the problem of choosing which of the processes in the ready queue is to be allocated the CPU.
In Round-Robin (RR) scheduling, a small unit of time called a time quantum (or time slice) is defined, generally from 10 to 100 milliseconds. The ready queue is treated as a circular FIFO queue. The CPU scheduler goes around the ready queue, allocating the CPU to each process for a time interval of up to 1 time quantum.
If the process has a CPU burst of less than 1 time quantum, the process releases the CPU voluntarily. If the CPU burst is longer than 1 time quantum, the timer will go off and cause an interrupt to the operating system. A context switch will be executed, and the process will be put at the tail of the ready queue.
The performance of the RR algorithm depends heavily on the size of the time quantum. If the time quantum is extremely large, RR is the same as the First-Come First-Served (FCFS) algorithm. If the time quantum is extremely small, RR is called processor sharing, and results in excessive context-switch overhead. As a rule of thumb, 80 percent of the CPU bursts should be shorter than the time quantum.`,
    keywords: ['cpu scheduling', 'round robin', 'time quantum', 'context switch', 'fcfs', 'ready queue']
  },
  {
    id: 'chk-os-102',
    docId: 'doc-tb-1',
    docTitle: 'Operating Systems Principles (8th Ed) - Silberschatz & Galvin',
    docType: 'textbook',
    section: 'Chapter 5.2: Preemptive vs Nonpreemptive Scheduling',
    text: `Scheduling algorithms can be categorized as either nonpreemptive or preemptive.
Under nonpreemptive scheduling, once the CPU has been allocated to a process, the process keeps the CPU until it releases the CPU, either by terminating or by switching to the waiting state.
In Shortest-Job-First (SJF), the CPU is assigned to the process with the smallest next CPU burst. Preemptive SJF is also known as Shortest-Remaining-Time-First (SRTF). When a new process arrives at the ready queue with a CPU burst length shorter than the remaining time of the currently executing process, the CPU is preempted and allocated to the newly arrived process.
SRTF minimizes average waiting time across all scheduling algorithms, but can lead to starvation for long processes if short processes continuously arrive.`,
    keywords: ['preemption', 'shortest remaining time first', 'srtf', 'sjf', 'starvation', 'waiting time']
  },
  {
    id: 'chk-os-201',
    docId: 'doc-tb-1',
    docTitle: 'Operating Systems Principles (8th Ed) - Silberschatz & Galvin',
    docType: 'textbook',
    section: 'Chapter 6.2: The Critical-Section Problem',
    text: `A critical section is a piece of code where a process accesses shared resources, such as shared memory or files. A proper solution to the critical-section problem must satisfy three mandatory criteria:
1. Mutual Exclusion: If process Pi is executing in its critical section, then no other processes can be executing in their critical sections.
2. Progress: If no process is executing in its critical section and some processes wish to enter their critical sections, only those processes that are not executing in their remainder sections can participate in deciding which will enter its critical section next, and this selection cannot be postponed indefinitely.
3. Bounded Waiting: There exists a bound, or limit, on the number of times that other processes are allowed to enter their critical sections after a process has made a request to enter its critical section and before that request is granted.`,
    keywords: ['critical section', 'mutual exclusion', 'progress', 'bounded waiting', 'race condition', 'concurrency']
  },
  {
    id: 'chk-os-202',
    docId: 'doc-tb-1',
    docTitle: 'Operating Systems Principles (8th Ed) - Silberschatz & Galvin',
    docType: 'textbook',
    section: 'Chapter 6.5: Semaphores and Mutexes',
    text: `A semaphore S is an integer variable that, apart from initialization, is accessed only through two standard atomic operations: wait() (historically called P) and signal() (historically called V).
Definition of wait(S): while (S <= 0) ; // busy wait; S--;
Definition of signal(S): S++;
Operating systems distinguish between counting and binary semaphores. The value of a counting semaphore can range over an unrestricted domain, representing the number of available instances of a resource. A binary semaphore's value can range only between 0 and 1, effectively functioning as a mutex lock.
A classic error is inversion of operations: executing signal() before wait(), or omitting signal(), which can cause indefinite deadlock or violation of mutual exclusion.`,
    keywords: ['semaphores', 'mutex', 'wait', 'signal', 'atomic', 'counting semaphore', 'binary semaphore']
  },
  {
    id: 'chk-os-203',
    docId: 'doc-tb-1',
    docTitle: 'Operating Systems Principles (8th Ed) - Silberschatz & Galvin',
    docType: 'textbook',
    section: 'Chapter 7.2: Deadlock Characterization & Prevention',
    text: `A deadlock situation can arise if and only if the following four Coffman conditions hold simultaneously in a system:
1. Mutual Exclusion: At least one resource must be held in a non-shareable mode.
2. Hold and Wait: A process must be holding at least one resource and waiting to acquire additional resources that are currently being held by other processes.
3. No Preemption: Resources cannot be preempted; that is, a resource can be released only voluntarily by the process holding it, after that process has completed its task.
4. Circular Wait: A closed chain of processes exists such that each process holds at least one resource needed by the next process in the chain (P0 waits for P1, P1 waits for P2, ..., Pn waits for P0).
To prevent deadlocks, the operating system can eliminate Circular Wait by imposing a total ordering on all resource types and requiring that each process requests resources in strictly increasing numerical order.`,
    keywords: ['deadlock', 'coffman conditions', 'circular wait', 'hold and wait', 'mutual exclusion', 'no preemption', 'resource ordering']
  },
  {
    id: 'chk-os-301',
    docId: 'doc-tb-1',
    docTitle: 'Operating Systems Principles (8th Ed) - Silberschatz & Galvin',
    docType: 'textbook',
    section: 'Chapter 8.4: Paging & Translation Lookaside Buffer (TLB)',
    text: `Paging is a memory-management scheme that permits the physical address space of a process to be noncontiguous. Physical memory is broken into fixed-sized blocks called frames. Logical memory is broken into blocks of the same size called pages.
Every address generated by the CPU is divided into two parts: a page number (p) and a page offset (d). The page number is used as an index into a page table, which yields the base address of each page in physical memory.
Because the page table is stored in main memory, accessing a memory location requires two memory accesses: one for the page-table entry and one for the actual byte. To resolve this speed penalty, modern hardware utilizes a Translation Lookaside Buffer (TLB), a high-speed associative hardware cache.
If the page number is found in the TLB (TLB Hit), the frame number is immediately available in ~1 ns. If it is not (TLB Miss), a memory reference to the page table must be made (~100 ns).
Effective Access Time (EAT) = (Hit_Ratio * (TLB_access + Memory_access)) + ((1 - Hit_Ratio) * (TLB_access + 2 * Memory_access)).`,
    keywords: ['paging', 'frames', 'page table', 'tlb', 'translation lookaside buffer', 'effective access time', 'eat', 'hit ratio']
  },
  {
    id: 'chk-os-302',
    docId: 'doc-tb-1',
    docTitle: 'Operating Systems Principles (8th Ed) - Silberschatz & Galvin',
    docType: 'textbook',
    section: 'Chapter 9.4: Page Replacement Algorithms & Belady Anomaly',
    text: `When a page fault occurs and no free frames exist in physical memory, the OS must choose a victim frame to page out.
1. FIFO (First-In, First-Out): Replaces the oldest loaded page. FIFO is subject to Belady's Anomaly, where increasing the number of page frames can unexpectedly increase the total number of page faults for certain reference strings (e.g. 1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5).
2. Optimal Page Replacement (OPT / MIN): Replaces the page that will not be used for the longest period of time in the future. OPT provides the lowest possible page fault rate, but requires clairvoyant future knowledge and cannot be implemented practically.
3. LRU (Least Recently Used): Approximates OPT by replacing the page that has not been used for the longest time in the past. LRU is a stack algorithm and is mathematically proven to never suffer from Belady's Anomaly.
4. Thrashing: Occurs when a system spends more time paging than executing instructions because the sum of working set sizes of all active processes exceeds total available physical frames.`,
    keywords: ['page replacement', 'fifo', 'belady anomaly', 'optimal replacement', 'lru', 'thrashing', 'page fault']
  },
  {
    id: 'chk-os-past-1',
    docId: 'doc-exam-1',
    docTitle: 'University Midterm Exam 2024 - Computer Systems Architecture',
    docType: 'past_papers',
    section: 'Problem 4: Concurrency & Synchronization Bug Diagnosis',
    text: `Question 4. (10 marks)
A junior engineer wrote the following locking code for two threads sharing two balances:
Thread 1: lock(A); lock(B); balance1 += 50; balance2 -= 50; unlock(B); unlock(A);
Thread 2: lock(B); lock(A); balance2 += 100; balance1 -= 100; unlock(A); unlock(B);
Explain why this system deadlocks under concurrent load. Which Coffman condition is directly violated, and how can the engineer rewrite the code to guarantee safety?
Model Solution:
This system produces a classic Circular Wait deadlock: Thread 1 holds lock A and requests lock B, while Thread 2 holds lock B and requests lock A. The circular wait condition holds (T1 -> B held by T2 -> A held by T1).
Fix: Enforce strict resource acquisition ordering. Both threads must acquire lock A first, then lock B:
Thread 2 fix: lock(A); lock(B); ... unlock(B); unlock(A);
By enforcing A < B ordering globally, circular wait is impossible.`,
    keywords: ['deadlock exam question', 'circular wait', 'resource acquisition order', 'lock order', 'concurrency bug']
  },
  {
    id: 'chk-os-past-2',
    docId: 'doc-exam-1',
    docTitle: 'University Midterm Exam 2024 - Computer Systems Architecture',
    docType: 'past_papers',
    section: 'Problem 7: Virtual Memory TLB Effective Access Time Calculation',
    text: `Question 7. (8 marks)
Given a system with a TLB access time of 20 ns and main memory access time of 100 ns.
Calculate the Effective Access Time (EAT) when the TLB hit ratio is:
(a) 80%
(b) 98%
Show your work with the theoretical derivation.
Model Solution:
EAT = Hit_Ratio * (TLB + Memory) + (1 - Hit_Ratio) * (TLB + 2 * Memory)
For hit: 20ns + 100ns = 120ns.
For miss: 20ns (TLB lookup) + 100ns (page table lookup) + 100ns (fetch byte) = 220ns.
(a) EAT = 0.80 * (120) + 0.20 * (220) = 96 + 44 = 140 ns.
(b) EAT = 0.98 * (120) + 0.02 * (220) = 117.6 + 4.4 = 122 ns.
Increasing hit ratio by 18% reduces memory access latency by 18 ns per instruction.`,
    keywords: ['eat calculation', 'tlb hit ratio', 'effective access time', 'page table latency', 'memory access']
  },

  // --- CS202: Database Management Systems Chunks ---
  {
    id: 'chk-db-101',
    docId: 'doc-db-tb-1',
    docTitle: 'Database System Concepts (7th Ed) - Silberschatz, Korth & Sudarshan',
    docType: 'textbook',
    section: 'Chapter 7: Relational Database Normalization',
    text: `A relation schema R is in Boyce-Codd Normal Form (BCNF) with respect to a set F of functional dependencies if, for all functional dependencies in F+ of the form alpha -> beta, where alpha is a subset of R and beta is a subset of R, at least one of the following holds:
1. alpha -> beta is a trivial functional dependency (that is, beta is a subset of alpha).
2. alpha is a superkey for schema R.
A relation is in Third Normal Form (3NF) if for all alpha -> beta in F+, either alpha -> beta is trivial, alpha is a superkey, or each attribute in beta - alpha is contained in a candidate key of R. Every BCNF schema is in 3NF, but not every 3NF schema satisfies BCNF.`,
    keywords: ['bcnf', '3nf', 'functional dependency', 'superkey', 'normalization', 'candidate key']
  },
  {
    id: 'chk-db-102',
    docId: 'doc-db-tb-1',
    docTitle: 'Database System Concepts (7th Ed) - Silberschatz, Korth & Sudarshan',
    docType: 'textbook',
    section: 'Chapter 14: Transactions & ACID Properties',
    text: `A transaction is a unit of program execution that accesses and possibly updates various data items. To preserve database integrity, the transaction system must guarantee the ACID properties:
1. Atomicity: Either all operations of the transaction are reflected properly in the database, or none are.
2. Consistency: Execution of a transaction in isolation preserves the consistency of the database.
3. Isolation: Even though multiple transactions execute concurrently, the system guarantees that for every pair of transactions Ti and Tj, it appears to Ti that either Tj finished before Ti started, or Tj started after Ti finished.
4. Durability: After a transaction completes successfully, the changes it has made to the database persist, even if the system crashes.`,
    keywords: ['transactions', 'acid properties', 'atomicity', 'consistency', 'isolation', 'durability', 'wal']
  },
  {
    id: 'chk-db-103',
    docId: 'doc-db-tb-1',
    docTitle: 'Database System Concepts (7th Ed) - Silberschatz, Korth & Sudarshan',
    docType: 'textbook',
    section: 'Chapter 15: Concurrency Control & Two-Phase Locking',
    text: `Two-Phase Locking (2PL) is a concurrency control protocol that guarantees conflict serializability. Under 2PL, a transaction must acquire locks in two distinct phases:
1. Growing Phase: A transaction may obtain locks, but may not release any lock.
2. Shrinking Phase: A transaction may release locks, but may not obtain any new locks.
The point at which a transaction acquires its final lock is the lock point.
Strict 2PL requires that all exclusive (X) locks acquired by a transaction be held until the transaction commits or aborts. Rigorous 2PL requires that all shared (S) and exclusive (X) locks be held until commit, preventing cascading aborts.`,
    keywords: ['two-phase locking', '2pl', 'conflict serializability', 'strict 2pl', 'rigorous 2pl', 'cascading aborts']
  },
  {
    id: 'chk-db-104',
    docId: 'doc-db-tb-1',
    docTitle: 'Database System Concepts (7th Ed) - Silberschatz, Korth & Sudarshan',
    docType: 'textbook',
    section: 'Chapter 11: Indexing & B+ Trees',
    text: `A B+ tree index takes the form of a balanced tree in which every path from the root of the tree to a leaf of the tree is of the same length.
Each nonleaf node contains up to n-1 search-key values and n pointers to child nodes. Nonleaf nodes form a multi-level sparse index over the leaf nodes.
Leaf nodes contain search-key values and pointers to records or buckets of records. All leaf nodes are chained together in a doubly linked list, enabling highly efficient range queries in O(log_n(N) + k) time.
B+ tree insertions and deletions preserve balanced depth through node splitting and merging, ensuring that disk I/O costs remain logarithmic.`,
    keywords: ['b+ trees', 'indexing', 'balanced tree', 'range queries', 'leaf nodes', 'search key', 'disk io']
  },

  // --- CS301: Machine Learning Fundamentals Chunks ---
  {
    id: 'chk-ml-101',
    docId: 'doc-ml-tb-1',
    docTitle: 'Pattern Recognition and Machine Learning - Christopher Bishop',
    docType: 'textbook',
    section: 'Chapter 1: Supervised Learning & Cost Functions',
    text: `In supervised learning, the objective is to predict target values given input feature vectors. For linear regression, the hypothesis is h_theta(x) = theta^T x.
The cost function measures discrepancy between predictions and true labels, typically formulated as Mean Squared Error (MSE):
J(theta) = (1 / 2m) * sum_{i=1}^m (h_theta(x^(i)) - y^(i))^2.
Gradient descent iteratively updates parameters in the direction of steepest descent:
theta_j := theta_j - alpha * (d/d theta_j) J(theta),
where alpha is the learning rate. If alpha is too small, gradient descent converges slowly. If alpha is too large, the algorithm can overshoot the global minimum, oscillating or diverging completely.`,
    keywords: ['supervised learning', 'linear regression', 'cost function', 'mean squared error', 'gradient descent', 'learning rate']
  },
  {
    id: 'chk-ml-102',
    docId: 'doc-ml-tb-1',
    docTitle: 'Pattern Recognition and Machine Learning - Christopher Bishop',
    docType: 'textbook',
    section: 'Chapter 3.2: Bias-Variance Decomposition & Regularization',
    text: `Generalization error can be decomposed into three components: Bias^2 + Variance + Irreducible Noise.
1. High Bias (Underfitting): The model is too simple to capture underlying data structure (e.g. fitting a straight line to quadratic data). Both training and test errors are high.
2. High Variance (Overfitting): The model fits training data too closely, capturing random noise. Training error is low, but test error is high.
To prevent overfitting, regularization penalties are added to the cost function:
L2 Regularization (Ridge): J_reg(theta) = J(theta) + lambda * sum(theta_j^2). Shrinks weights towards zero smoothly.
L1 Regularization (Lasso): J_reg(theta) = J(theta) + lambda * sum(|theta_j|). Drives non-essential feature weights to exactly zero, performing automatic feature selection.`,
    keywords: ['bias variance tradeoff', 'overfitting', 'underfitting', 'regularization', 'l1 lasso', 'l2 ridge', 'lambda']
  },
  {
    id: 'chk-ml-103',
    docId: 'doc-ml-tb-1',
    docTitle: 'Pattern Recognition and Machine Learning - Christopher Bishop',
    docType: 'textbook',
    section: 'Chapter 4.3: Logistic Regression & Cross-Entropy',
    text: `For binary classification, linear regression predictions can exceed [0, 1]. Logistic regression maps continuous predictions to probabilities using the sigmoid function:
g(z) = 1 / (1 + e^(-z)), where z = theta^T x.
The hypothesis represents P(y = 1 | x; theta).
Because Mean Squared Error produces a non-convex cost surface with multiple local minima when combined with the sigmoid function, logistic regression uses the convex Binary Cross-Entropy loss:
J(theta) = -(1/m) * sum [ y^(i) * log(h_theta(x^(i))) + (1 - y^(i)) * log(1 - h_theta(x^(i))) ].
This guarantees that gradient descent converges reliably to the global minimum.`,
    keywords: ['logistic regression', 'sigmoid', 'binary cross-entropy', 'classification', 'convex loss', 'decision boundary']
  },
  {
    id: 'chk-ml-104',
    docId: 'doc-ml-tb-1',
    docTitle: 'Pattern Recognition and Machine Learning - Christopher Bishop',
    docType: 'textbook',
    section: 'Chapter 5: Neural Networks & Backpropagation',
    text: `Multilayer Perceptrons (MLPs) extend linear models through compositions of hidden layers with nonlinear activation functions: a^(l) = sigma(W^(l) a^(l-1) + b^(l)).
Training utilizes backpropagation to calculate partial derivatives of the loss with respect to all weights using the chain rule of calculus.
A classic failure mode in deep architectures is the Vanishing Gradient problem: when using saturating activations like Sigmoid, gradients of activations for large magnitude inputs approach zero (sigma'(z) -> 0). When propagated back through multiple layers, gradients diminish exponentially, preventing early layers from learning.
Modern architectures address this using the Rectified Linear Unit (ReLU): f(z) = max(0, z), whose derivative is 1 for positive inputs.`,
    keywords: ['neural networks', 'backpropagation', 'vanishing gradient', 'relu', 'sigmoid', 'activation functions', 'chain rule']
  }
];

// ==========================================================
// 2. TOPICS (Operating Systems, Database Systems, Machine Learning)
// ==========================================================
export const SAMPLE_TOPICS: TopicNode[] = [
  {
    id: 'topic-cpu-sched',
    courseId: 'course-cs201',
    title: 'CPU Scheduling & Preemptive Algorithms',
    unit: 'Unit 1: Process Management & CPU Scheduling',
    description: 'Round Robin time quanta, Shortest Remaining Time First (SRTF), context-switch overhead, and processor sharing.',
    syllabusWeightage: 18,
    estimatedMinutesToMaster: 45,
    bloomLevel: 'Apply',
    masteryStatus: 'strong',
    currentScore: 92,
    attemptsCount: 3,
    subtopics: [
      'Round Robin (RR) Scheduling & Quantum Sizing',
      'Shortest-Remaining-Time-First (SRTF) Preemption',
      'Context Switch Overhead Calculations'
    ],
    prerequisites: ['Process Control Blocks (PCB)', 'CPU Burst Cycles'],
    referenceSections: ['Chapter 5.2', 'Chapter 5.3']
  },
  {
    id: 'topic-critical-section',
    courseId: 'course-cs201',
    title: 'Critical Section & Concurrency Control',
    unit: 'Unit 2: Concurrency & Synchronization',
    description: 'Mutual exclusion, progress, bounded waiting criteria, and atomic hardware primitives.',
    syllabusWeightage: 22,
    estimatedMinutesToMaster: 60,
    bloomLevel: 'Analyze',
    masteryStatus: 'medium',
    currentScore: 68,
    attemptsCount: 2,
    subtopics: [
      'The 3 Critical Section Requirements',
      'Peterson’s 2-Process Algorithm',
      'Atomic Test-and-Set & Compare-and-Swap'
    ],
    prerequisites: ['Thread Scheduling', 'Race Conditions'],
    referenceSections: ['Chapter 6.2', 'Chapter 6.4']
  },
  {
    id: 'topic-semaphores-deadlocks',
    courseId: 'course-cs201',
    title: 'Semaphores & Deadlock Prevention',
    unit: 'Unit 2: Concurrency & Synchronization',
    description: 'Counting semaphores, binary mutexes, Coffman conditions, and circular wait elimination.',
    syllabusWeightage: 20,
    estimatedMinutesToMaster: 50,
    bloomLevel: 'Evaluate',
    masteryStatus: 'weak',
    currentScore: 42,
    attemptsCount: 2,
    subtopics: [
      'Counting vs Binary Semaphores (wait/signal)',
      'The 4 Coffman Deadlock Conditions',
      'Resource Acquisition Total Ordering'
    ],
    prerequisites: ['Critical Section', 'Mutual Exclusion'],
    referenceSections: ['Chapter 6.5', 'Chapter 7.2', 'Exam Problem 4']
  },
  {
    id: 'topic-paging-tlb',
    courseId: 'course-cs201',
    title: 'Paging Architecture & TLB Effective Access Time',
    unit: 'Unit 3: Memory Management & Virtual Memory',
    description: 'Frames, pages, page-table lookup penalties, and Translation Lookaside Buffer (TLB) mathematical derivations.',
    syllabusWeightage: 25,
    estimatedMinutesToMaster: 65,
    bloomLevel: 'Apply',
    masteryStatus: 'weak',
    currentScore: 35,
    attemptsCount: 1,
    subtopics: [
      'Page Number (p) and Offset (d) Translation',
      'Effective Access Time (EAT) Equations',
      'Multi-Level Paging Latency Penalties'
    ],
    prerequisites: ['Physical Addressing', 'Hardware Caching'],
    referenceSections: ['Chapter 8.4', 'Exam Problem 7']
  },
  {
    id: 'topic-page-replacement',
    courseId: 'course-cs201',
    title: 'Page Replacement Algorithms & Belady\'s Anomaly',
    unit: 'Unit 3: Memory Management & Virtual Memory',
    description: 'FIFO, LRU stack algorithms, Optimal replacement, thrashing, and Belady anomaly proofs.',
    syllabusWeightage: 15,
    estimatedMinutesToMaster: 40,
    bloomLevel: 'Understand',
    masteryStatus: 'medium',
    currentScore: 60,
    attemptsCount: 2,
    subtopics: [
      'FIFO vs LRU Replacement Comparison',
      'Belady’s Anomaly Anomaly Mechanics',
      'Working-Set Model & Thrashing Prevention'
    ],
    prerequisites: ['Paging Architecture'],
    referenceSections: ['Chapter 9.4']
  }
];

export const DBMS_TOPICS: TopicNode[] = [
  {
    id: 'topic-db-norm',
    courseId: 'course-cs202',
    title: 'Relational Model & Normalization (1NF to BCNF)',
    unit: 'Unit 1: Relational Theory & Schema Design',
    description: 'Functional dependencies, candidate keys, 3NF synthesis, and Boyce-Codd Normal Form (BCNF) decomposition.',
    syllabusWeightage: 25,
    estimatedMinutesToMaster: 55,
    bloomLevel: 'Analyze',
    masteryStatus: 'strong',
    currentScore: 88,
    attemptsCount: 3,
    subtopics: ['Functional Dependencies & Armstrong Axioms', '3NF vs BCNF Conditions', 'Lossless Join & Dependency Preservation'],
    prerequisites: ['Relational Algebra'],
    referenceSections: ['Chapter 7.1', 'Chapter 7.4']
  },
  {
    id: 'topic-db-acid',
    courseId: 'course-cs202',
    title: 'Transaction Management & ACID Guarantees',
    unit: 'Unit 2: Transactions & Recovery',
    description: 'Atomicity, Consistency, Isolation, Durability, Write-Ahead Logging (WAL), and checkpointing.',
    syllabusWeightage: 25,
    estimatedMinutesToMaster: 50,
    bloomLevel: 'Understand',
    masteryStatus: 'medium',
    currentScore: 74,
    attemptsCount: 2,
    subtopics: ['ACID Definitions', 'Write-Ahead Logging (WAL)', 'Deferred vs Immediate Modification'],
    prerequisites: ['Relational Storage'],
    referenceSections: ['Chapter 14.1']
  },
  {
    id: 'topic-db-2pl',
    courseId: 'course-cs202',
    title: 'Concurrency Control & Two-Phase Locking (2PL)',
    unit: 'Unit 3: Concurrency Control',
    description: 'Conflict serializability, precedence graphs, Strict 2PL, Rigorous 2PL, and avoiding cascading aborts.',
    syllabusWeightage: 25,
    estimatedMinutesToMaster: 60,
    bloomLevel: 'Apply',
    masteryStatus: 'weak',
    currentScore: 48,
    attemptsCount: 2,
    subtopics: ['Precedence Graphs & Cycle Detection', 'Growing vs Shrinking Lock Phases', 'Strict vs Rigorous 2PL Guarantees'],
    prerequisites: ['Transactions ACID'],
    referenceSections: ['Chapter 15.1', 'Chapter 15.2']
  },
  {
    id: 'topic-db-index',
    courseId: 'course-cs202',
    title: 'Database Indexing & B+ Tree Architectures',
    unit: 'Unit 4: Storage & Indexing',
    description: 'Dense vs sparse indices, B+ tree node splitting, height calculations, and logarithmic range search.',
    syllabusWeightage: 25,
    estimatedMinutesToMaster: 45,
    bloomLevel: 'Apply',
    masteryStatus: 'medium',
    currentScore: 66,
    attemptsCount: 2,
    subtopics: ['B+ Tree Node Structure & Fanout', 'Search & Range Query Traversal', 'Splitting & Merging Invariants'],
    prerequisites: ['File Organization'],
    referenceSections: ['Chapter 11.2']
  }
];

export const ML_TOPICS: TopicNode[] = [
  {
    id: 'topic-ml-grad',
    courseId: 'course-cs301',
    title: 'Cost Functions & Gradient Descent Optimization',
    unit: 'Unit 1: Supervised Regression & Optimization',
    description: 'Mean Squared Error (MSE), batch vs stochastic gradient descent, learning rate alpha, and divergence.',
    syllabusWeightage: 25,
    estimatedMinutesToMaster: 50,
    bloomLevel: 'Apply',
    masteryStatus: 'strong',
    currentScore: 90,
    attemptsCount: 3,
    subtopics: ['MSE Cost Formulation', 'Gradient Update Equations', 'Learning Rate Oscillations & Divergence'],
    prerequisites: ['Multivariate Calculus', 'Linear Algebra'],
    referenceSections: ['Chapter 1.1', 'Chapter 1.2']
  },
  {
    id: 'topic-ml-reg',
    courseId: 'course-cs301',
    title: 'Bias-Variance Tradeoff & Regularization (L1 / L2)',
    unit: 'Unit 2: Generalization & Model Selection',
    description: 'Underfitting vs overfitting, L2 Ridge penalty weight shrinkage, and L1 Lasso sparsity feature selection.',
    syllabusWeightage: 25,
    estimatedMinutesToMaster: 55,
    bloomLevel: 'Analyze',
    masteryStatus: 'weak',
    currentScore: 44,
    attemptsCount: 2,
    subtopics: ['Bias-Variance Decomposition', 'Ridge L2 Weight Decay', 'Lasso L1 Sparsity Penalization'],
    prerequisites: ['Linear Regression'],
    referenceSections: ['Chapter 3.2']
  },
  {
    id: 'topic-ml-logistic',
    courseId: 'course-cs301',
    title: 'Logistic Regression & Cross-Entropy Loss',
    unit: 'Unit 3: Classification & Probability',
    description: 'Sigmoid activation, probability mapping, binary cross-entropy cost convexity, and decision boundaries.',
    syllabusWeightage: 25,
    estimatedMinutesToMaster: 50,
    bloomLevel: 'Understand',
    masteryStatus: 'strong',
    currentScore: 84,
    attemptsCount: 2,
    subtopics: ['Sigmoid Function Non-Linearity', 'Binary Cross-Entropy Loss', 'Decision Boundary Equations'],
    prerequisites: ['Gradient Descent'],
    referenceSections: ['Chapter 4.3']
  },
  {
    id: 'topic-ml-nn',
    courseId: 'course-cs301',
    title: 'Neural Networks & Vanishing Gradients',
    unit: 'Unit 4: Deep Learning Foundations',
    description: 'Multilayer perceptrons, chain rule backpropagation, vanishing gradient problem, and ReLU activations.',
    syllabusWeightage: 25,
    estimatedMinutesToMaster: 65,
    bloomLevel: 'Evaluate',
    masteryStatus: 'medium',
    currentScore: 62,
    attemptsCount: 2,
    subtopics: ['Backpropagation Chain Rule', 'Vanishing Gradients in Sigmoid Networks', 'ReLU Non-Saturating Activation'],
    prerequisites: ['Logistic Regression'],
    referenceSections: ['Chapter 5.1', 'Chapter 5.3']
  }
];

// ==========================================================
// 3. DOCUMENTS (Operating Systems, Database Systems, Machine Learning)
// ==========================================================
export const SAMPLE_DOCUMENTS: UploadedDocument[] = [
  {
    id: 'doc-syl-1',
    courseId: 'course-cs201',
    title: 'Official Syllabus - CS201 Operating Systems Core (Accredited)',
    type: 'syllabus',
    content: `Official University Syllabus for CS201: Operating Systems & System Architecture. Unit 1: Process Management & CPU Scheduling (18%). Unit 2: Concurrency & Synchronization (42%). Unit 3: Memory Management & Paging (40%).`,
    chunks: [
      {
        id: 'chk-syl-1',
        docId: 'doc-syl-1',
        docTitle: 'Official Syllabus - CS201 Operating Systems Core (Accredited)',
        docType: 'syllabus',
        section: 'Course Overview & Weightage Table',
        text: 'Unit 1: CPU Scheduling (18%), Unit 2: Synchronization & Deadlocks (42%), Unit 3: Memory Management & Paging (40%). Total exam score: 100 points.',
        keywords: ['syllabus', 'weightage', 'operating systems', 'unit 1', 'unit 2', 'unit 3']
      }
    ],
    uploadDate: '2026-10-20',
    sizeBytes: 14200
  },
  {
    id: 'doc-tb-1',
    courseId: 'course-cs201',
    title: 'Operating Systems Principles (8th Ed) - Silberschatz & Galvin',
    type: 'textbook',
    content: `Core Textbook Chapters covering CPU Scheduling, Semaphores, Deadlocks, Paging, and Page Replacement Algorithms.`,
    chunks: SAMPLE_CHUNKS.filter(c => c.docId === 'doc-tb-1'),
    uploadDate: '2026-10-20',
    sizeBytes: 852000
  },
  {
    id: 'doc-exam-1',
    courseId: 'course-cs201',
    title: 'University Midterm Exam 2024 - Computer Systems Architecture',
    type: 'past_papers',
    content: `Selected Midterm examination problems with instructor model solutions and analytical explanations.`,
    chunks: SAMPLE_CHUNKS.filter(c => c.docId === 'doc-exam-1'),
    uploadDate: '2026-10-22',
    sizeBytes: 120400
  }
];

export const DBMS_DOCUMENTS: UploadedDocument[] = [
  {
    id: 'doc-db-syl-1',
    courseId: 'course-cs202',
    title: 'Official Syllabus - CS202 Database Management Systems',
    type: 'syllabus',
    content: `Official Syllabus for CS202 Database Systems. Unit 1: Normalization (25%), Unit 2: Transactions & ACID (25%), Unit 3: Concurrency Control (25%), Unit 4: B+ Tree Indexing (25%).`,
    chunks: [
      {
        id: 'chk-db-syl-1',
        docId: 'doc-db-syl-1',
        docTitle: 'Official Syllabus - CS202 Database Management Systems',
        docType: 'syllabus',
        section: 'Curriculum & Weightage',
        text: 'Unit 1: Normalization (25%), Unit 2: Transactions (25%), Unit 3: Concurrency (25%), Unit 4: Indexing (25%).',
        keywords: ['syllabus', 'database', 'weightage', 'normalization', 'concurrency']
      }
    ],
    uploadDate: '2026-10-20',
    sizeBytes: 13500
  },
  {
    id: 'doc-db-tb-1',
    courseId: 'course-cs202',
    title: 'Database System Concepts (7th Ed) - Silberschatz, Korth & Sudarshan',
    type: 'textbook',
    content: `Standard text covering BCNF, ACID properties, 2-Phase Locking, and B+ Tree indexing.`,
    chunks: SAMPLE_CHUNKS.filter(c => c.docId === 'doc-db-tb-1'),
    uploadDate: '2026-10-20',
    sizeBytes: 780000
  }
];

export const ML_DOCUMENTS: UploadedDocument[] = [
  {
    id: 'doc-ml-syl-1',
    courseId: 'course-cs301',
    title: 'Official Syllabus - CS301 Machine Learning Fundamentals',
    type: 'syllabus',
    content: `Official Syllabus for CS301 Machine Learning. Unit 1: Gradient Descent (25%), Unit 2: Regularization (25%), Unit 3: Classification (25%), Unit 4: Neural Networks (25%).`,
    chunks: [
      {
        id: 'chk-ml-syl-1',
        docId: 'doc-ml-syl-1',
        docTitle: 'Official Syllabus - CS301 Machine Learning Fundamentals',
        docType: 'syllabus',
        section: 'Curriculum & Weightage',
        text: 'Unit 1: Optimization (25%), Unit 2: Bias-Variance (25%), Unit 3: Logistic Regression (25%), Unit 4: Deep Learning (25%).',
        keywords: ['syllabus', 'machine learning', 'gradient descent', 'regularization', 'neural networks']
      }
    ],
    uploadDate: '2026-10-20',
    sizeBytes: 14100
  },
  {
    id: 'doc-ml-tb-1',
    courseId: 'course-cs301',
    title: 'Pattern Recognition and Machine Learning - Christopher Bishop',
    type: 'textbook',
    content: `Foundational text on regression, bias-variance tradeoff, cross-entropy, and backpropagation.`,
    chunks: SAMPLE_CHUNKS.filter(c => c.docId === 'doc-ml-tb-1'),
    uploadDate: '2026-10-20',
    sizeBytes: 920000
  }
];

// ==========================================================
// 4. QUIZ QUESTIONS (Grounded in chunks with citations)
// ==========================================================
export const SAMPLE_QUIZ_QUESTIONS: QuizQuestion[] = [
  // --- CS201 OS Questions ---
  {
    id: 'q-cpu-1',
    topicId: 'topic-cpu-sched',
    topicTitle: 'CPU Scheduling & Preemptive Algorithms',
    question: 'In Round-Robin (RR) scheduling, what is the consequence of choosing an extremely small time quantum (e.g., 0.1 ms)?',
    options: [
      'The scheduling algorithm degenerates into First-Come First-Served (FCFS)',
      'The system achieves optimal average waiting time with negligible CPU overhead',
      'The system experiences excessive context-switching overhead, degrading effective CPU throughput',
      'Long-burst processes will suffer total starvation'
    ],
    correctOptionIndex: 2,
    explanation: 'When the time quantum is extremely small, the scheduler switches processes so frequently that CPU time is wasted on saving and restoring registers (context switches) rather than executing user code.',
    misconceptionExplanation: 'Common pitfall: Confusing small quantum with FCFS. Large quantum acts like FCFS; extremely small quantum creates processor sharing with severe context-switch thrash.',
    citation: {
      docId: 'doc-tb-1',
      docTitle: 'Operating Systems Principles (8th Ed) - Silberschatz & Galvin',
      docType: 'textbook',
      section: 'Chapter 5.3: CPU Scheduling Algorithms',
      snippet: 'If the time quantum is extremely small, RR is called processor sharing, and results in excessive context-switch overhead.'
    },
    difficulty: 'medium',
    type: 'concept_check'
  },
  {
    id: 'q-crit-1',
    topicId: 'topic-critical-section',
    topicTitle: 'Critical Section & Concurrency Control',
    question: 'Which of the following is NOT one of the three mandatory criteria required for a correct solution to the Critical Section problem?',
    options: [
      'Mutual Exclusion: Only one process inside the critical section at any given time',
      'Progress: Selection of who enters next cannot be postponed indefinitely',
      'Bounded Waiting: Limit on the number of times others can enter before a request is granted',
      'Strict Priority Preemption: High priority threads can interrupt a process inside its critical section'
    ],
    correctOptionIndex: 3,
    explanation: 'The three mandatory criteria defined by Dijkstra and Silberschatz are Mutual Exclusion, Progress, and Bounded Waiting. "Strict Priority Preemption" violates Mutual Exclusion and is not a criterion.',
    misconceptionExplanation: 'Students often assume OS priority preempts everything; however, critical sections protect shared invariant state, so preemption within critical sections without atomic locks causes corruption.',
    citation: {
      docId: 'doc-tb-1',
      docTitle: 'Operating Systems Principles (8th Ed) - Silberschatz & Galvin',
      docType: 'textbook',
      section: 'Chapter 6.2: The Critical-Section Problem',
      snippet: 'A solution to the critical-section problem must satisfy three criteria: Mutual Exclusion, Progress, and Bounded Waiting.'
    },
    difficulty: 'medium',
    type: 'concept_check'
  },
  {
    id: 'q-dead-1',
    topicId: 'topic-semaphores-deadlocks',
    topicTitle: 'Semaphores & Deadlock Prevention',
    question: 'A junior engineer wrote locking code where Thread 1 acquires lock A then B, while Thread 2 acquires lock B then A. Which Coffman condition is directly satisfied, enabling deadlock, and how is it prevented?',
    options: [
      'Hold and Wait; prevented by allocating all resources at process startup',
      'Circular Wait; prevented by enforcing a global resource acquisition ordering (e.g. acquire A before B in both threads)',
      'Mutual Exclusion; prevented by sharing lock variables without synchronization',
      'No Preemption; prevented by forcibly aborting lower priority threads on contention'
    ],
    correctOptionIndex: 1,
    explanation: 'When Thread 1 holds A and waits for B, while Thread 2 holds B and waits for A, a Circular Wait graph cycle forms. Imposing a global linear order on resource acquisitions (A < B) mathematically breaks the possibility of circular wait.',
    misconceptionExplanation: 'Students frequently misdiagnose this as a failure of Mutual Exclusion, when in reality mutual exclusion is functioning as designed—the vulnerability is the circular dependency of acquisition orders.',
    citation: {
      docId: 'doc-exam-1',
      docTitle: 'University Midterm Exam 2024 - Computer Systems Architecture',
      docType: 'past_papers',
      section: 'Problem 4: Concurrency & Synchronization Bug Diagnosis',
      snippet: 'Fix: Enforce strict resource acquisition ordering. Both threads must acquire lock A first, then lock B... By enforcing A < B ordering globally, circular wait is impossible.'
    },
    difficulty: 'hard',
    type: 'past_exam_analysis'
  },
  {
    id: 'q-tlb-1',
    topicId: 'topic-paging-tlb',
    topicTitle: 'Paging Architecture & TLB Effective Access Time',
    question: 'Given a computer with a TLB access time of 20 ns, physical memory access time of 100 ns, and a TLB hit ratio of 80%, what is the Effective Access Time (EAT)?',
    options: [
      '120 ns',
      '140 ns',
      '220 ns',
      '100 ns'
    ],
    correctOptionIndex: 1,
    explanation: 'EAT = Hit_Ratio * (TLB + Mem) + (1 - Hit_Ratio) * (TLB + 2 * Mem). Hit time = 20 + 100 = 120 ns. Miss time = 20 + 100 (page table) + 100 (data) = 220 ns. EAT = 0.8 * 120 + 0.2 * 220 = 96 + 44 = 140 ns.',
    misconceptionExplanation: 'A frequent error is forgetting that on a TLB miss, the system must perform TWO memory accesses: one to read the Page Table Entry, and one to read the actual memory byte!',
    citation: {
      docId: 'doc-exam-1',
      docTitle: 'University Midterm Exam 2024 - Computer Systems Architecture',
      docType: 'past_papers',
      section: 'Problem 7: Virtual Memory TLB Effective Access Time Calculation',
      snippet: 'For miss: 20ns (TLB lookup) + 100ns (page table lookup) + 100ns (fetch byte) = 220ns. EAT = 0.80 * (120) + 0.20 * (220) = 96 + 44 = 140 ns.'
    },
    difficulty: 'hard',
    type: 'application_problem'
  },
  {
    id: 'q-page-1',
    topicId: 'topic-page-replacement',
    topicTitle: 'Page Replacement Algorithms & Belady\'s Anomaly',
    question: 'Which page replacement algorithm is vulnerable to Belady\'s Anomaly, where giving a process MORE physical memory frames can increase the number of page faults?',
    options: [
      'Least Recently Used (LRU)',
      'Optimal Page Replacement (OPT / MIN)',
      'First-In, First-Out (FIFO)',
      'Working Set Clock Algorithm'
    ],
    correctOptionIndex: 2,
    explanation: 'FIFO is the classic algorithm exhibiting Belady\'s Anomaly because it is not a stack algorithm. LRU and Optimal are stack algorithms (the set of pages for n frames is always a subset of n+1 frames) and are mathematically proven immune to Belady\'s anomaly.',
    misconceptionExplanation: 'Intuition suggests that more RAM always reduces page faults. But FIFO does not track frequency or recency of access; it replaces the oldest loaded page, kicking out hot pages in larger frame pools.',
    citation: {
      docId: 'doc-tb-1',
      docTitle: 'Operating Systems Principles (8th Ed) - Silberschatz & Galvin',
      docType: 'textbook',
      section: 'Chapter 9.4: Page Replacement Algorithms & Belady Anomaly',
      snippet: 'FIFO is subject to Belady\'s Anomaly, where increasing the number of page frames can unexpectedly increase the total number of page faults for certain reference strings.'
    },
    difficulty: 'medium',
    type: 'concept_check'
  },

  // --- CS202 DBMS Questions ---
  {
    id: 'q-db-norm-1',
    topicId: 'topic-db-norm',
    topicTitle: 'Relational Model & Normalization (1NF to BCNF)',
    question: 'Under what condition is a relation schema R strictly in Boyce-Codd Normal Form (BCNF) with respect to functional dependency set F?',
    options: [
      'Every non-prime attribute is fully functionally dependent on a candidate key',
      'For every non-trivial functional dependency alpha -> beta, alpha is a superkey of R',
      'Every attribute in beta is a prime attribute contained in some candidate key',
      'The relation has no multi-valued dependencies'
    ],
    correctOptionIndex: 1,
    explanation: 'BCNF requires that for every non-trivial dependency alpha -> beta, alpha must be a superkey. If an attribute on the right is prime but alpha is not a superkey, the schema may be in 3NF but fails BCNF.',
    misconceptionExplanation: 'Students frequently confuse 3NF and BCNF. 3NF allows alpha not to be a superkey if beta is prime; BCNF removes this relaxation.',
    citation: {
      docId: 'doc-db-tb-1',
      docTitle: 'Database System Concepts (7th Ed) - Silberschatz, Korth & Sudarshan',
      docType: 'textbook',
      section: 'Chapter 7: Relational Database Normalization',
      snippet: 'A relation schema R is in BCNF if for all alpha -> beta in F+, either alpha -> beta is trivial, or alpha is a superkey for schema R.'
    },
    difficulty: 'medium',
    type: 'concept_check'
  },
  {
    id: 'q-db-2pl-1',
    topicId: 'topic-db-2pl',
    topicTitle: 'Concurrency Control & Two-Phase Locking (2PL)',
    question: 'How does Strict Two-Phase Locking (Strict 2PL) differ from standard basic Two-Phase Locking (2PL)?',
    options: [
      'Strict 2PL prevents deadlocks while basic 2PL does not',
      'Strict 2PL requires all Exclusive (X) locks to be held until transaction commit/abort, preventing cascading rollbacks',
      'Strict 2PL does not allow shared (S) read locks',
      'Strict 2PL releases locks as soon as the write operation finishes'
    ],
    correctOptionIndex: 1,
    explanation: 'Basic 2PL allows locks to be released during the shrinking phase before commit, which can cause cascading aborts if another transaction reads uncommitted data. Strict 2PL holds exclusive locks until commit, guaranteeing strictness and avoiding cascading aborts.',
    misconceptionExplanation: '2PL does NOT prevent deadlocks! Both basic 2PL and Strict 2PL can still deadlock and require wait-for graphs or timeouts.',
    citation: {
      docId: 'doc-db-tb-1',
      docTitle: 'Database System Concepts (7th Ed) - Silberschatz, Korth & Sudarshan',
      docType: 'textbook',
      section: 'Chapter 15: Concurrency Control & Two-Phase Locking',
      snippet: 'Strict 2PL requires that all exclusive locks acquired by a transaction be held until the transaction commits or aborts, preventing cascading aborts.'
    },
    difficulty: 'hard',
    type: 'application_problem'
  },

  // --- CS301 ML Questions ---
  {
    id: 'q-ml-grad-1',
    topicId: 'topic-ml-grad',
    topicTitle: 'Cost Functions & Gradient Descent Optimization',
    question: 'During gradient descent for linear regression, what occurs if the learning rate alpha is chosen to be excessively large?',
    options: [
      'Gradient descent converges to a suboptimal local minimum rather than the global minimum',
      'The parameter updates overshoot the valley minimum, causing the cost function J(theta) to oscillate or diverge to infinity',
      'The model suffers from excessive variance and overfits the training set',
      'Parameters become sparse with many weights driven to exactly zero'
    ],
    correctOptionIndex: 1,
    explanation: 'When alpha is too large, each step overshoots the minimum point on the convex MSE surface. The distance from the minimum increases with each iteration, causing divergence.',
    misconceptionExplanation: 'Linear regression MSE is strictly convex with NO local minima! Thus, large learning rate causes divergence, not trapping in local minima.',
    citation: {
      docId: 'doc-ml-tb-1',
      docTitle: 'Pattern Recognition and Machine Learning - Christopher Bishop',
      docType: 'textbook',
      section: 'Chapter 1: Supervised Learning & Cost Functions',
      snippet: 'If alpha is too large, the algorithm can overshoot the global minimum, oscillating or diverging completely.'
    },
    difficulty: 'medium',
    type: 'concept_check'
  },
  {
    id: 'q-ml-reg-1',
    topicId: 'topic-ml-reg',
    topicTitle: 'Bias-Variance Tradeoff & Regularization (L1 / L2)',
    question: 'What is the key geometric and practical difference between L1 Regularization (Lasso) and L2 Regularization (Ridge)?',
    options: [
      'L2 produces sparse models with exact zero weights, while L1 only shrinks weights smoothly',
      'L1 regularization drives non-essential feature weights to exactly zero performing feature selection, due to the diamond constraint corners',
      'L1 only applies to classification, while L2 only applies to regression',
      'L2 regularization increases model variance compared to unregularized regression'
    ],
    correctOptionIndex: 1,
    explanation: 'The L1 norm constraint has sharp corners on the coordinate axes. The contours of the loss function frequently intersect these corners first, setting redundant feature weights to exactly zero.',
    misconceptionExplanation: 'A classic mistake is reversing L1 and L2: Ridge (L2) shrinks weights close to zero but rarely exactly zero; Lasso (L1) creates exact zero weights.',
    citation: {
      docId: 'doc-ml-tb-1',
      docTitle: 'Pattern Recognition and Machine Learning - Christopher Bishop',
      docType: 'textbook',
      section: 'Chapter 3.2: Bias-Variance Decomposition & Regularization',
      snippet: 'L1 Regularization (Lasso) drives non-essential feature weights to exactly zero, performing automatic feature selection.'
    },
    difficulty: 'hard',
    type: 'application_problem'
  }
];

// ==========================================================
// 5. PRELOADED COURSES
// ==========================================================
export const CS201_COURSE: Course = {
  id: 'course-cs201',
  title: 'CS201: Operating Systems',
  subjectCode: 'CS-201',
  description: 'Undergraduate core computer science course covering CPU scheduling, thread concurrency, semaphores, virtual memory TLBs, and page replacement mechanics.',
  targetExam: 'Final University Examination (Dec 2026)',
  documents: SAMPLE_DOCUMENTS,
  topics: SAMPLE_TOPICS,
  isPreloaded: true
};

export const CS202_COURSE: Course = {
  id: 'course-cs202',
  title: 'CS202: Database Management Systems',
  subjectCode: 'CS-202',
  description: 'Undergraduate database theory course covering relational algebra, BCNF normalization, ACID transactions, 2-Phase Locking (2PL), and B+ Tree indexing.',
  targetExam: 'Midterm & Final Examination',
  documents: DBMS_DOCUMENTS,
  topics: DBMS_TOPICS,
  isPreloaded: true
};

export const CS301_COURSE: Course = {
  id: 'course-cs301',
  title: 'CS301: Machine Learning Fundamentals',
  subjectCode: 'CS-301',
  description: 'Core machine learning course covering supervised learning, gradient descent optimization, cost functions, regularization (L1/L2), and neural network backpropagation.',
  targetExam: 'University Comprehensive Assessment',
  documents: ML_DOCUMENTS,
  topics: ML_TOPICS,
  isPreloaded: true
};

// Backwards-compatible aliases
export const INITIAL_PRELOADED_COURSE: Course = CS201_COURSE;
export const PRELOADED_COURSES: Course[] = [CS201_COURSE, CS202_COURSE, CS301_COURSE];

// ==========================================================
// 6. TEACHER SUBJECTS & STUDENT PERFORMANCE ROSTER
// ==========================================================
export const TEACHER_SUBJECTS_DATA: TeacherSubjectClass[] = [
  // Subject 1: CS201 Operating Systems
  {
    id: 'subj-cs201',
    subjectTitle: 'CS201: Operating Systems',
    subjectCode: 'CS-201',
    semester: 'Fall Semester 2026 (Section A)',
    enrolledStudentsCount: 30,
    activeSignedInCount: 28,
    classAverageScore: 68,
    criticalGapCount: 3,
    topPerformersCount: 8,
    commonWeakTopic: 'Virtual Memory & Paging (FIFO Belady\'s Anomaly)',
    students: [
      {
        id: 'std-alex-chen-os',
        name: 'Alex Chen',
        email: 'alex.chen@gapfinder.demo',
        enrolledSubject: 'CS201: Operating Systems',
        subjectCode: 'CS-201',
        quizzesAttempted: 4,
        overallScore: 74,
        performanceTier: 'Proficient',
        weakestTopic: 'Virtual Memory & Page Replacement',
        strongestTopic: 'CPU Scheduling (Round Robin & SJF)',
        primaryCognitiveGap: 'Conceptual Misunderstanding',
        lastActive: 'Today, 2:15 PM',
        recommendedRemedial: 'Assign 15-min interactive drill on stack vs non-stack page replacement algorithms.',
        topicScores: {
          'CPU Scheduling': 92,
          'Process Synchronization': 80,
          'Deadlock Handling': 70,
          'Virtual Memory Paging': 54
        }
      },
      {
        id: 'std-priya-sharma-os',
        name: 'Priya Sharma',
        email: 'priya.sharma@gapfinder.demo',
        enrolledSubject: 'CS201: Operating Systems',
        subjectCode: 'CS-201',
        quizzesAttempted: 4,
        overallScore: 81,
        performanceTier: 'High Distinction',
        weakestTopic: 'Banker\'s Safety Vector Calculations',
        strongestTopic: 'Counting Semaphores vs Binary Mutex',
        primaryCognitiveGap: 'Application / Formula Slip',
        lastActive: 'Today, 1:10 PM',
        recommendedRemedial: 'Practice Available, Allocation, Max matrix subtraction exercises.',
        topicScores: {
          'CPU Scheduling': 86,
          'Process Synchronization': 88,
          'Deadlock Handling': 76,
          'Virtual Memory Paging': 74
        }
      },
      {
        id: 'std-2',
        name: 'Maya Patel',
        email: 'maya.patel@university.edu',
        enrolledSubject: 'CS201: Operating Systems',
        subjectCode: 'CS-201',
        quizzesAttempted: 5,
        overallScore: 92,
        performanceTier: 'High Distinction',
        weakestTopic: 'Semaphore Inversion Race Conditions',
        strongestTopic: 'Deadlock Banker\'s Safety Algorithm',
        primaryCognitiveGap: 'Application / Formula Slip',
        lastActive: 'Today, 11:30 AM',
        recommendedRemedial: 'Candidate for peer tutoring mentor on Concurrency and Deadlocks.',
        topicScores: {
          'CPU Scheduling': 98,
          'Process Synchronization': 88,
          'Deadlock Handling': 95,
          'Virtual Memory Paging': 87
        }
      },
      {
        id: 'std-3',
        name: 'David Kim',
        email: 'david.kim@university.edu',
        enrolledSubject: 'CS201: Operating Systems',
        subjectCode: 'CS-201',
        quizzesAttempted: 2,
        overallScore: 42,
        performanceTier: 'Critical Gap',
        weakestTopic: 'Deadlock Circular Wait Ordering',
        strongestTopic: 'FCFS Scheduling Concepts',
        primaryCognitiveGap: 'Recall Failure',
        lastActive: 'Yesterday',
        recommendedRemedial: 'Schedule 1-on-1 office hours on Coffman 4 conditions and resource graphs.',
        topicScores: {
          'CPU Scheduling': 58,
          'Process Synchronization': 40,
          'Deadlock Handling': 32,
          'Virtual Memory Paging': 38
        }
      },
      {
        id: 'std-4',
        name: 'Elena Rostova',
        email: 'elena.rostova@university.edu',
        enrolledSubject: 'CS201: Operating Systems',
        subjectCode: 'CS-201',
        quizzesAttempted: 5,
        overallScore: 88,
        performanceTier: 'High Distinction',
        weakestTopic: 'TLB Hit Ratio & Effective Access Time',
        strongestTopic: 'Critical Section Mutual Exclusion',
        primaryCognitiveGap: 'Application / Formula Slip',
        lastActive: 'Today, 9:45 AM',
        recommendedRemedial: 'Review formula: EAT = (HitRatio * (TLB + Mem)) + ((1 - HitRatio) * (TLB + 2*Mem)).',
        topicScores: {
          'CPU Scheduling': 94,
          'Process Synchronization': 90,
          'Deadlock Handling': 88,
          'Virtual Memory Paging': 80
        }
      },
      {
        id: 'std-5',
        name: 'Marcus Johnson',
        email: 'marcus.j@university.edu',
        enrolledSubject: 'CS201: Operating Systems',
        subjectCode: 'CS-201',
        quizzesAttempted: 3,
        overallScore: 51,
        performanceTier: 'Needs Attention',
        weakestTopic: 'Belady\'s Anomaly in FIFO Replacement',
        strongestTopic: 'Preemptive vs Nonpreemptive Scheduling',
        primaryCognitiveGap: 'Conceptual Misunderstanding',
        lastActive: '2 days ago',
        recommendedRemedial: 'Provide visual counterexample for FIFO with 3 vs 4 frames on sequence 1,2,3,4,1,2,5,1,2,3,4,5.',
        topicScores: {
          'CPU Scheduling': 68,
          'Process Synchronization': 55,
          'Deadlock Handling': 48,
          'Virtual Memory Paging': 33
        }
      },
      {
        id: 'std-7',
        name: 'Liam O\'Connor',
        email: 'liam.oc@university.edu',
        enrolledSubject: 'CS201: Operating Systems',
        subjectCode: 'CS-201',
        quizzesAttempted: 1,
        overallScore: 38,
        performanceTier: 'Critical Gap',
        weakestTopic: 'Process Synchronization & Race Conditions',
        strongestTopic: 'Basic Process States',
        primaryCognitiveGap: 'Recall Failure',
        lastActive: '3 days ago',
        recommendedRemedial: 'Urgent intervention needed: re-test foundational concepts with grounded notes.',
        topicScores: {
          'CPU Scheduling': 46,
          'Process Synchronization': 28,
          'Deadlock Handling': 42,
          'Virtual Memory Paging': 36
        }
      },
      {
        id: 'std-8',
        name: 'Sophia Zhang',
        email: 'sophia.zhang@university.edu',
        enrolledSubject: 'CS201: Operating Systems',
        subjectCode: 'CS-201',
        quizzesAttempted: 6,
        overallScore: 96,
        performanceTier: 'High Distinction',
        weakestTopic: 'None (Full Mastery)',
        strongestTopic: 'Virtual Memory & Multi-Level Page Tables',
        primaryCognitiveGap: 'None (Mastered)',
        lastActive: 'Today, 3:00 PM',
        recommendedRemedial: 'Assign advanced extension challenges (e.g. Inverted Page Table hashing simulation).',
        topicScores: {
          'CPU Scheduling': 98,
          'Process Synchronization': 96,
          'Deadlock Handling': 94,
          'Virtual Memory Paging': 96
        }
      }
    ]
  },

  // Subject 2: CS202 Database Management Systems
  {
    id: 'subj-cs202',
    subjectTitle: 'CS202: Database Management Systems',
    subjectCode: 'CS-202',
    semester: 'Fall Semester 2026 (Section B)',
    enrolledStudentsCount: 34,
    activeSignedInCount: 31,
    classAverageScore: 72,
    criticalGapCount: 2,
    topPerformersCount: 11,
    commonWeakTopic: 'B+ Tree Indexing & 2-Phase Locking (2PL)',
    students: [
      {
        id: 'std-alex-chen-db',
        name: 'Alex Chen',
        email: 'alex.chen@gapfinder.demo',
        enrolledSubject: 'CS202: Database Systems',
        subjectCode: 'CS-202',
        quizzesAttempted: 3,
        overallScore: 78,
        performanceTier: 'Proficient',
        weakestTopic: 'Conflict Serializability & Precedence Graphs',
        strongestTopic: 'SQL Relational Algebra & Joins',
        primaryCognitiveGap: 'Conceptual Misunderstanding',
        lastActive: 'Yesterday',
        recommendedRemedial: 'Review topological sorting on cycle detection for serializability graphs.',
        topicScores: {
          'Relational Model & Normalization': 88,
          'Transaction ACID Properties': 74,
          'Indexing & B+ Trees': 76,
          'Concurrency Control': 64
        }
      },
      {
        id: 'std-202',
        name: 'Maya Patel',
        email: 'maya.patel@university.edu',
        enrolledSubject: 'CS202: Database Systems',
        subjectCode: 'CS-202',
        quizzesAttempted: 4,
        overallScore: 94,
        performanceTier: 'High Distinction',
        weakestTopic: 'Strict vs Rigorous 2PL',
        strongestTopic: 'BCNF Normalization Decomposition',
        primaryCognitiveGap: 'Application / Formula Slip',
        lastActive: 'Today, 10:00 AM',
        recommendedRemedial: 'Ready for database query optimizer and cost estimation exercises.',
        topicScores: {
          'Relational Model & Normalization': 96,
          'Transaction ACID Properties': 94,
          'Indexing & B+ Trees': 92,
          'Concurrency Control': 94
        }
      },
      {
        id: 'std-203',
        name: 'David Kim',
        email: 'david.kim@university.edu',
        enrolledSubject: 'CS202: Database Systems',
        subjectCode: 'CS-202',
        quizzesAttempted: 2,
        overallScore: 49,
        performanceTier: 'Needs Attention',
        weakestTopic: '3NF vs BCNF Functional Dependencies',
        strongestTopic: 'Basic SQL SELECT Queries',
        primaryCognitiveGap: 'Recall Failure',
        lastActive: 'Yesterday',
        recommendedRemedial: 'Assign Armstrong Axioms and candidate key derivation drills.',
        topicScores: {
          'Relational Model & Normalization': 45,
          'Transaction ACID Properties': 52,
          'Indexing & B+ Trees': 48,
          'Concurrency Control': 51
        }
      }
    ]
  },

  // Subject 3: CS301 Machine Learning Fundamentals
  {
    id: 'subj-cs301',
    subjectTitle: 'CS301: Machine Learning Fundamentals',
    subjectCode: 'CS-301',
    semester: 'Fall Semester 2026 (Advanced Core)',
    enrolledStudentsCount: 26,
    activeSignedInCount: 24,
    classAverageScore: 76,
    criticalGapCount: 2,
    topPerformersCount: 9,
    commonWeakTopic: 'Bias-Variance Tradeoff & L1 vs L2 Regularization',
    students: [
      {
        id: 'std-priya-sharma-ml',
        name: 'Priya Sharma',
        email: 'priya.sharma@gapfinder.demo',
        enrolledSubject: 'CS301: Machine Learning',
        subjectCode: 'CS-301',
        quizzesAttempted: 4,
        overallScore: 88,
        performanceTier: 'High Distinction',
        weakestTopic: 'Gradient Descent Learning Rate Oscillations',
        strongestTopic: 'Supervised Learning Cost Functions',
        primaryCognitiveGap: 'Application / Formula Slip',
        lastActive: 'Today, 2:30 PM',
        recommendedRemedial: 'Practice step-size updates with learning rate decay schedules.',
        topicScores: {
          'Cost Functions & Gradients': 92,
          'Bias-Variance & Regularization': 80,
          'Logistic Regression': 90,
          'Neural Net Backprop': 88
        }
      },
      {
        id: 'std-401',
        name: 'Sophia Zhang',
        email: 'sophia.zhang@university.edu',
        enrolledSubject: 'CS301: Machine Learning',
        subjectCode: 'CS-301',
        quizzesAttempted: 5,
        overallScore: 95,
        performanceTier: 'High Distinction',
        weakestTopic: 'None (Full Mastery)',
        strongestTopic: 'Backpropagation & Neural Networks',
        primaryCognitiveGap: 'None (Mastered)',
        lastActive: 'Today, 2:30 PM',
        recommendedRemedial: 'Advanced study: Transformers and Self-Attention mechanisms.',
        topicScores: {
          'Cost Functions & Gradients': 96,
          'Bias-Variance & Regularization': 94,
          'Logistic Regression': 98,
          'Neural Net Backprop': 92
        }
      },
      {
        id: 'std-402',
        name: 'Liam O\'Connor',
        email: 'liam.oc@university.edu',
        enrolledSubject: 'CS301: Machine Learning',
        subjectCode: 'CS-301',
        quizzesAttempted: 2,
        overallScore: 52,
        performanceTier: 'Needs Attention',
        weakestTopic: 'Vanishing Gradient Problem in Sigmoid Networks',
        strongestTopic: 'Linear Regression Cost Formulation',
        primaryCognitiveGap: 'Conceptual Misunderstanding',
        lastActive: '2 days ago',
        recommendedRemedial: 'Assign ReLU activation and He initialization visual comparison module.',
        topicScores: {
          'Cost Functions & Gradients': 68,
          'Bias-Variance & Regularization': 48,
          'Logistic Regression': 52,
          'Neural Net Backprop': 40
        }
      }
    ]
  }
];
