import { Course, DocumentChunk, QuizQuestion, TopicNode, UploadedDocument } from '@/types';

export const SAMPLE_CHUNKS: DocumentChunk[] = [
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
    id: 'chk-os-401',
    docId: 'doc-tb-1',
    docTitle: 'Operating Systems Principles (8th Ed) - Silberschatz & Galvin',
    docType: 'textbook',
    section: 'Chapter 10.4: Disk Scheduling Algorithms',
    text: `The operating system is responsible for using hardware efficiently. For magnetic disk drives, this means having fast access times and high disk bandwidth.
The seek time is the time for the disk arm to move the heads to the cylinder containing the desired sector.
In SCAN scheduling (the elevator algorithm), the disk arm starts at one end of the disk and moves toward the other end, servicing requests as it reaches each cylinder until it gets to the other end of the disk. At the other end, the direction of head movement is reversed, and servicing continues.
C-SCAN (Circular SCAN) provides a more uniform wait time. Like SCAN, C-SCAN moves the head from one end of the disk to the other, servicing requests along the way. When the head reaches the other end, however, it immediately returns to the beginning of the disk without servicing any requests on the return trip.`,
    keywords: ['disk scheduling', 'seek time', 'scan', 'c-scan', 'elevator algorithm', 'head movement']
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
  }
];

export const SAMPLE_TOPICS: TopicNode[] = [
  {
    id: 'topic-cpu-sched',
    courseId: 'course-cs301',
    title: 'CPU Scheduling & Preemptive Algorithms',
    unit: 'Unit 1: Process Management & CPU Scheduling',
    description: 'Round Robin time quanta, Shortest Remaining Time First (SRTF), context-switch overhead, and processor sharing.',
    syllabusWeightage: 18,
    estimatedMinutesToMaster: 45,
    bloomLevel: 'Apply',
    masteryStatus: 'untested',
    subtopics: ['Round Robin (RR)', 'Shortest Remaining Time First (SRTF)', 'Context Switch Latency', 'Time Quantum Optimization'],
    prerequisites: ['Process States', 'Process Control Block (PCB)'],
    referenceSections: ['Chapter 5.2: Preemptive vs Nonpreemptive', 'Chapter 5.3: CPU Scheduling Algorithms']
  },
  {
    id: 'topic-critical-section',
    courseId: 'course-cs301',
    title: 'Critical Section & Concurrency Control',
    unit: 'Unit 2: Synchronization & Concurrency',
    description: 'Mutual Exclusion, Progress, Bounded Waiting conditions, race condition diagnosis, and lock primitives.',
    syllabusWeightage: 20,
    estimatedMinutesToMaster: 55,
    bloomLevel: 'Analyze',
    masteryStatus: 'untested',
    subtopics: ['Race Conditions', 'Peterson Algorithm', 'Mutual Exclusion Criteria', 'Progress & Bounded Waiting'],
    prerequisites: ['Shared Memory', 'Thread Execution'],
    referenceSections: ['Chapter 6.2: The Critical-Section Problem', 'Problem 4: Concurrency & Synchronization Bug Diagnosis']
  },
  {
    id: 'topic-semaphores-deadlock',
    courseId: 'course-cs301',
    title: 'Semaphores & Deadlock Prevention',
    unit: 'Unit 2: Synchronization & Concurrency',
    description: 'Counting vs Binary Semaphores, Coffman conditions, Circular Wait elimination via strict resource ordering.',
    syllabusWeightage: 22,
    estimatedMinutesToMaster: 60,
    bloomLevel: 'Evaluate',
    masteryStatus: 'untested',
    subtopics: ['Counting vs Binary Semaphores', 'Coffman 4 Conditions', 'Circular Wait Elimination', 'Resource Acquisition Hierarchies'],
    prerequisites: ['Critical Section'],
    referenceSections: ['Chapter 6.5: Semaphores and Mutexes', 'Chapter 7.2: Deadlock Characterization & Prevention']
  },
  {
    id: 'topic-paging-tlb',
    courseId: 'course-cs301',
    title: 'Paging Architecture & TLB Effective Access Time',
    unit: 'Unit 3: Memory Management & Virtual Memory',
    description: 'Two-level page tables, TLB hits/misses, and mathematical calculation of Effective Access Time (EAT).',
    syllabusWeightage: 22,
    estimatedMinutesToMaster: 50,
    bloomLevel: 'Apply',
    masteryStatus: 'untested',
    subtopics: ['Page vs Frame Addressing', 'Page Table Structure', 'TLB Hardware Cache', 'EAT Mathematical Derivations'],
    prerequisites: ['Physical Memory Addressing', 'Binary Translation'],
    referenceSections: ['Chapter 8.4: Paging & Translation Lookaside Buffer', 'Problem 7: Virtual Memory TLB EAT Calculation']
  },
  {
    id: 'topic-page-replacement',
    courseId: 'course-cs301',
    title: 'Page Replacement Algorithms & Belady\'s Anomaly',
    unit: 'Unit 3: Memory Management & Virtual Memory',
    description: 'FIFO vs LRU vs Optimal (MIN) algorithms, Belady Anomaly conditions, and Thrashing prevention using the Working Set Model.',
    syllabusWeightage: 18,
    estimatedMinutesToMaster: 40,
    bloomLevel: 'Analyze',
    masteryStatus: 'untested',
    subtopics: ['FIFO Anomaly Demonstration', 'LRU Stack Mechanism', 'Optimal Page Replacement', 'Thrashing & Working Set'],
    prerequisites: ['Paging Architecture'],
    referenceSections: ['Chapter 9.4: Page Replacement Algorithms & Belady Anomaly']
  }
];

export const SAMPLE_DOCUMENTS: UploadedDocument[] = [
  {
    id: 'doc-syl-1',
    courseId: 'course-cs301',
    title: 'Official Syllabus - CS301 Operating Systems Core (Accredited)',
    type: 'syllabus',
    content: `# CS301 Operating Systems Syllabus
Course Objective: Understand core principles of process management, concurrent synchronization, virtual memory hierarchies, and storage systems.
Unit 1: Process Management & Scheduling (18% Weightage)
- CPU scheduling algorithms (FCFS, SJF, SRTF, Round Robin)
- Context switching overhead and quantum trade-offs
Unit 2: Synchronization & Deadlocks (42% Weightage)
- Critical section requirements: Mutual Exclusion, Progress, Bounded Waiting
- Semaphores (counting vs binary), atomic primitives
- Deadlock characterization (4 Coffman conditions) and prevention via hierarchical ordering
Unit 3: Memory Management (40% Weightage)
- Paging, Translation Lookaside Buffer (TLB), Effective Access Time calculations
- Page replacement algorithms: FIFO, LRU, Optimal
- Belady's Anomaly and Thrashing mechanisms`,
    chunks: [
      {
        id: 'chk-syl-1',
        docId: 'doc-syl-1',
        docTitle: 'Official Syllabus - CS301 Operating Systems Core (Accredited)',
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
    courseId: 'course-cs301',
    title: 'Operating Systems Principles (8th Ed) - Silberschatz & Galvin',
    type: 'textbook',
    content: `Core Textbook Chapters covering CPU Scheduling, Semaphores, Deadlocks, Paging, and Page Replacement Algorithms.`,
    chunks: SAMPLE_CHUNKS.filter(c => c.docId === 'doc-tb-1'),
    uploadDate: '2026-10-20',
    sizeBytes: 852000
  },
  {
    id: 'doc-exam-1',
    courseId: 'course-cs301',
    title: 'University Midterm Exam 2024 - Computer Systems Architecture',
    type: 'past_papers',
    content: `Selected Midterm examination problems with instructor model solutions and analytical explanations.`,
    chunks: SAMPLE_CHUNKS.filter(c => c.docId === 'doc-exam-1'),
    uploadDate: '2026-10-22',
    sizeBytes: 120400
  }
];

export const SAMPLE_QUIZ_QUESTIONS: QuizQuestion[] = [
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
      snippet: 'A solution to the critical-section problem must satisfy three criteria: 1. Mutual Exclusion, 2. Progress, 3. Bounded Waiting.'
    },
    difficulty: 'easy',
    type: 'concept_check'
  },
  {
    id: 'q-dead-1',
    topicId: 'topic-semaphores-deadlock',
    topicTitle: 'Semaphores & Deadlock Prevention',
    question: 'A deadlock occurs between Thread 1 (holding Lock A, requesting Lock B) and Thread 2 (holding Lock B, requesting Lock A). Which Coffman condition does this directly establish, and what is the standard prevention protocol?',
    options: [
      'No Preemption; solved by terminating Thread 2 immediately',
      'Circular Wait; prevented by enforcing a global numerical acquisition order (e.g., always acquire Lock A before Lock B)',
      'Hold and Wait; prevented by multiplying the time slice quantum',
      'Mutual Exclusion; prevented by converting all locks to read-only access'
    ],
    correctOptionIndex: 1,
    explanation: 'The scenario is the textbook Circular Wait condition (T1 -> B held by T2 -> A held by T1). The standard operating system prevention strategy is imposing a total ordering on resources and forcing all threads to acquire locks in strictly increasing order.',
    misconceptionExplanation: 'Students often know that deadlocks have 4 conditions, but fail to identify Circular Wait as the single condition easily prevented programmatically via resource hierarchies.',
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
  }
];

export const INITIAL_PRELOADED_COURSE: Course = {
  id: 'course-cs301',
  title: 'CS301: Operating Systems & System Architecture',
  subjectCode: 'CS-301-CORE',
  description: 'Undergraduate core computer science course covering CPU scheduling, thread concurrency, semaphores, virtual memory TLBs, and page replacement mechanics.',
  targetExam: 'Final University Examination (Dec 2026)',
  documents: SAMPLE_DOCUMENTS,
  topics: SAMPLE_TOPICS,
  isPreloaded: true
};
