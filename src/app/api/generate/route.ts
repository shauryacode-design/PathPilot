// import { NextResponse } from "next/server";
// import { GoogleGenerativeAI } from "@google/generative-ai";

// function safeParseJSON(text: string) {
//   try {
//     return JSON.parse(text);
//   } catch {
//     return null;
//   }
// }

// // For testing/demo purposes - returns a sample roadmap
// function getDemoRoadmap(formData: any) {
//   return {

//     title: `${formData.goal} - Learning Roadmap`,
//     duration: "3-4 months",
//     goal: formData.goal,
//     steps: [
//       {
//         id: 1,
//         title: "Foundation & Basics",
//         duration: "3 weeks",
//         description: "Build strong fundamentals with comprehensive tutorials and courses",
//         resources: [
//           { name: "Official Documentation", link: "https://docs.example.com", type: "Documentation" },
//           { name: "Beginner Course", link: "https://coursera.org", type: "Course" }
//         ],
//         tasks: [
//           "Set up development environment",
//           "Learn core concepts",
//           "Complete 5 tutorial projects"
//         ]
//       },
//       {
//         id: 2,
//         title: "Hands-on Projects",
//         duration: "4 weeks",
//         description: "Apply knowledge through real-world projects",
//         resources: [
//           { name: "Project Ideas List", link: "https://github.com", type: "GitHub" },
//           { name: "Advanced Course", link: "https://udemy.com", type: "Course" }
//         ],
//         tasks: [
//           "Build first portfolio project",
//           "Deploy to production",
//           "Get code reviewed"
//         ]
//       },
//       {
//         id: 3,
//         title: "Advanced Topics",
//         duration: "3 weeks",
//         description: "Master advanced concepts specific to your goal",
//         resources: [
//           { name: "Advanced Guide", link: "https://docs.example.com", type: "Guide" },
//           { name: "Expert Course", link: "https://masterclass.com", type: "Course" }
//         ],
//         tasks: [
//           "Deep dive into architecture",
//           "Implement complex features",
//           "Optimize performance"
//         ]
//       },
//       {
//         id: 4,
//         title: "Specialization",
//         duration: "2 weeks",
//         description: `Focus on ${formData.interest} specialization`,
//         resources: [
//           { name: "Specialization Path", link: "https://example.com", type: "Learning Path" },
//           { name: "Community Forum", link: "https://community.example.com", type: "Community" }
//         ],
//         tasks: [
//           `Create ${formData.interest} project`,
//           "Contribute to open source",
//           "Build professional portfolio"
//         ]
//       }
//     ],
//     totalTasks: 12
//   };
// }

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const { name, age, course, year, stream, interest, goal, timeforgoal, skillLevel } = body;





//     // Create the prompt
//     const prompt = `You are a career guidance expert for students.
// Generate a detailed personalized roadmap for this student:

// Name: ${name}
// Age: ${age}
// Course: ${course}
// Year: ${year}
// Stream: ${stream}
// Interest: ${interest}
// Career Goal: ${goal}
// Daily Time Available: ${timeforgoal}
// Skill Level: ${skillLevel}

// Return ONLY a valid JSON object with this exact structure, no markdown, no extra text:
// {
//   "title": "Roadmap title",
//   "duration": "X months",
//   "goal": "${goal}",
//   "steps": [
//     {
//       "id": 1,
//       "title": "Step title",
//       "duration": "X weeks",
//       "description": "What to do in this step",
//       "resources": [
//         {
//           "name": "Resource name",
//           "link": "https://example.com",
//           "type": "Course"
//         }
//       ],
//       "tasks": [
//         "Task 1",
//         "Task 2",
//         "Task 3"
//       ]
//     }
//   ],
//   "totalTasks": 0
// }

// Generate 4-6 steps. Make it specific, practical and actionable for a student.`;

//     // Try Google Gemini first (free tier available)
//     const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

//     try {
//       console.log("🔄 Trying Gemini SDK...");

//       const model = genAI.getGenerativeModel({
//         model: "gemini-1.5-flash",
//       });

//       const result = await model.generateContent(prompt);

//       const text = result.response.text();

//       const cleaned = text.replace(/```json|```/g, "").trim();

//       const roadmap = safeParseJSON(cleaned);

//       if (roadmap) {
//         console.log("✅ Gemini succeeded");

//         return NextResponse.json({
//           success: true,
//           roadmap,
//           provider: "gemini",
//         });
//       }

//       console.log("❌ Gemini returned invalid JSON");

//     } catch (err) {
//       console.error("❌ Gemini failed:", err);
//     }

//     // Try multiple models in order of preference
//     const MODELS_TO_TRY = [
//       "meta-llama/llama-3.3-8b-instruct:free",
//       "google/gemma-3-27b-it:free",
//       "mistralai/mistral-small-3.1-24b-instruct:free"
//     ];

//     console.log('🔄 Trying OpenRouter with models:', MODELS_TO_TRY);
//     for (const model of MODELS_TO_TRY) {
//       console.log(`🔄 Attempting model: ${model}`);

//       try {
//         const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
//           method: 'POST',
//           headers: {
//             'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
//             'Content-Type': 'application/json',
//             'HTTP-Referer': 'http://localhost:3000',
//             'X-Title': 'PathPilot'
//           },
//           body: JSON.stringify({
//             model: model,
//             messages: [
//               {
//                 role: 'user',
//                 content: prompt
//               }
//             ],
//             temperature: 0.7,
//             max_tokens: 2000
//           })
//         });

//         console.log(`📨 Model ${model} response status:`, response.status);

//         if (!response.ok) {
//           const errorData = await response.json();
//           console.error(`❌ Model ${model} failed:`, errorData);
//           continue; // Try next model
//         }

//         const data = await response.json();
//         console.log(`✅ Model ${model} succeeded`, 'Response tokens:', data.usage?.total_tokens);

//         if (!data.choices || !data.choices[0] || !data.choices[0].message) {
//           console.error(`❌ Invalid response structure from ${model}:`, data);
//           continue; // Try next model
//         }

//         const text = data.choices[0].message.content;
//         const cleaned = text.replace(/```json|```/g, '').trim();
//         const roadmap = safeParseJSON(cleaned);
//         console.log(`✅ Generated by ${model}`);

//         if (!roadmap) {
//           continue;
//         }
//         return NextResponse.json({ success: true, roadmap });

//       } catch (modelError) {
//         console.error(`❌ Error with model ${model}:`, modelError);
//         continue; // Try next model
//       }
//     }

//     console.warn("⚠️ Using demo fallback roadmap");

//     const roadmap = getDemoRoadmap(body);

//     return NextResponse.json({
//       success: true,
//       roadmap,
//       fallback: true
//     });

//   } catch (error) {
//     console.error('Route error:', error);
//     return NextResponse.json(
//       { success: false, error: error instanceof Error ? error.message : String(error) },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";

function safeParseJSON(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}


// ==============================
// DEMO ROADMAP FALLBACK
// ==============================
function getDemoRoadmap(formData: any) {
  return {
    title: `${formData.goal} Learning Roadmap`,
    duration: "4 Months",
    goal: formData.goal,

    steps: [
      {
        id: 1,
        title: "Build Fundamentals",
        duration: "3 Weeks",
        description:
          "Learn the core concepts and fundamentals required for your career path.",

        resources: [
          {
            name: "YouTube Beginner Guide",
            link: "https://youtube.com",
            type: "Video",
          },
          {
            name: "Official Documentation",
            link: "https://developer.mozilla.org",
            type: "Documentation",
          },
        ],

        tasks: [
          "Understand the basic concepts",
          "Watch beginner tutorials",
          "Create small practice projects",
        ],
      },

      {
        id: 2,
        title: "Intermediate Learning",
        duration: "4 Weeks",
        description:
          "Start building real-world understanding through projects and deeper learning.",

        resources: [
          {
            name: "Udemy Course",
            link: "https://udemy.com",
            type: "Course",
          },
        ],

        tasks: [
          "Build 2 intermediate projects",
          "Practice problem solving",
          "Learn industry tools",
        ],
      },

      {
        id: 3,
        title: "Advanced Projects",
        duration: "5 Weeks",
        description:
          "Work on advanced real-world projects to strengthen your portfolio.",

        resources: [
          {
            name: "GitHub Open Source",
            link: "https://github.com",
            type: "GitHub",
          },
        ],

        tasks: [
          "Create portfolio-level project",
          "Deploy your application",
          "Optimize performance",
        ],
      },

      {
        id: 4,
        title: "Career Preparation",
        duration: "2 Weeks",
        description:
          "Prepare yourself for internships, jobs, freelancing, or startup opportunities.",

        resources: [
          {
            name: "Interview Preparation",
            link: "https://leetcode.com",
            type: "Practice",
          },
        ],

        tasks: [
          "Update resume",
          "Create LinkedIn profile",
          "Apply for opportunities",
        ],
      },
    ],

    totalTasks: 12,
  };
}
function detectCareerType(goal: string) {
  const lowerGoal = goal.toLowerCase();

  if (
    lowerGoal.includes("developer") ||
    lowerGoal.includes("software") ||
    lowerGoal.includes("web") ||
    lowerGoal.includes("ai") ||
    lowerGoal.includes("data scientist") ||
    lowerGoal.includes("programmer")
  ) {
    return "tech";
  }

  if (
    lowerGoal.includes("upsc") ||
    lowerGoal.includes("ias") ||
    lowerGoal.includes("ips") ||
    lowerGoal.includes("government") ||
    lowerGoal.includes("ssc") ||
    lowerGoal.includes("bank po") ||
    lowerGoal.includes("income tax officer")
  ) {
    return "government_exam";
  }

  if (
    lowerGoal.includes("designer") ||
    lowerGoal.includes("ui/ux") ||
    lowerGoal.includes("graphic")
  ) {
    return "creative";
  }

  if (
    lowerGoal.includes("doctor") ||
    lowerGoal.includes("medical") ||
    lowerGoal.includes("neet")
  ) {
    return "medical";
  }

  if (
    lowerGoal.includes("ca") ||
    lowerGoal.includes("accountant") ||
    lowerGoal.includes("finance")
  ) {
    return "finance";
  }

  if (
    lowerGoal.includes("lawyer") ||
    lowerGoal.includes("judge") ||
    lowerGoal.includes("law")
  ) {
    return "law";
  }

  if (
    lowerGoal.includes("youtuber") ||
    lowerGoal.includes("content creator") ||
    lowerGoal.includes("influencer")
  ) {
    return "creator";
  }

  return "general";
}

function getCareerRules(careerType: string) {
  switch (careerType) {
    case "tech":
      return `
Focus on:
- coding skills
- projects
- GitHub
- deployment
- portfolio building
- internships
- DSA
`;

    case "government_exam":
      return `
Focus on:
- exam syllabus
- mock tests
- PYQs
- revision strategy
- current affairs
- time management
- subject-wise preparation

NEVER include:
- coding projects
- deployment
- GitHub
`;

    case "creative":
      return `
Focus on:
- portfolio design
- creativity exercises
- client projects
- design tools
- visual practice
`;

    case "medical":
      return `
Focus on:
- entrance preparation
- clinical understanding
- practical study
- revision cycles
- subject mastery
`;

    case "finance":
      return `
Focus on:
- accounting concepts
- certifications
- internships
- financial analysis
- practical finance tools
`;

    case "law":
      return `
Focus on:
- legal concepts
- case studies
- judiciary exams
- legal drafting
- internships
`;

    case "creator":
      return `
Focus on:
- content creation
- audience growth
- storytelling
- editing skills
- platform consistency
- monetization
`;

    default:
      return `
Create a highly practical and goal-specific roadmap.
Avoid generic tasks.
`;
  }
}

// ==============================
// MAIN API ROUTE
// ==============================
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      name,
      age,
      course,
      year,
      stream,
      interest,
      goal,
      timeforgoal,
      skillLevel,
    } = body;

    console.log("🚀 Generating roadmap...");

    const careerType = detectCareerType(goal);

    const careerRules = getCareerRules(careerType);

    console.log("🎯 Career Type:", careerType);

    // ==============================
    // AI PROMPT
    // ==============================
    const prompt = `
You are PathPilot AI, an expert AI career mentor and roadmap architect for students.

Your task is to generate a highly practical, realistic, professional, and personalized career roadmap for the student.

The roadmap must:
- feel industry-level
- be logically sequenced
- be beginner-friendly if needed
- focus on real-world skills

- avoid generic advice

========================
STUDENT DETAILS
========================

Name: ${name}
Age: ${age}
Course: ${course}
Year: ${year}
Stream: ${stream}
Interest: ${interest}
Career Goal: ${goal}
Achievement Time: ${timeforgoal}
Skill Level: ${skillLevel}

========================
IMPORTANT INSTRUCTIONS
========================

1. Generate 4-6 roadmap steps maximum.

2. Every step must:
- build naturally on the previous step
- have a clear purpose
- help the student move closer to the final goal

3. Tasks must be:
- specific
- actionable
- practical
- beginner-friendly when needed
- project-oriented
- realistic for students

BAD TASK EXAMPLE:
- "Learn programming"

GOOD TASK EXAMPLE:
- "Build a responsive portfolio website using React and Tailwind CSS"

4. Resources must be HIGH QUALITY and REAL.

Use trusted platforms like:
- freeCodeCamp
- Coursera
- Udemy
- YouTube
- Harvard CS50
- Kaggle
- roadmap.sh
- MDN Docs
- GeeksforGeeks
- official documentation
- GitHub repositories

5. NEVER generate fake resources or fake URLs.

6. Every step should contain:
- 2 to 4 resources
- 3 to 5 practical tasks

7. Resources must match:
- the student's skill level
- the student's career goal
- the student's available time
- the roadmap step difficulty

8. Mix resource types:
- video courses
- documentation
- practice platforms
- project tutorials

9. Prefer FREE resources whenever possible.

10. Make the roadmap feel motivating and premium.

========================
CAREER-SPECIFIC RULES
========================

Career Type: ${careerType}

${careerRules}

IMPORTANT:
- The roadmap MUST feel unique to this career path.
- Do NOT generate repetitive universal tasks.
- Different career goals must produce very different roadmap structures.
- NEVER force coding/project/deployment tasks into non-technical careers.
- The roadmap should feel professionally designed specifically for this student's goal.

========================
RETURN FORMAT
========================

Return ONLY valid JSON.
Do NOT return markdown.
Do NOT return explanations.
Do NOT wrap JSON inside \`\`\`.

Use this exact structure:

{
  "title": "string",
  "duration": "string",
  "goal": "string",
  "steps": [
    {
      "id": 1,
      "title": "string",
      "duration": "string",
      "description": "string",
      "resources": [
        {
          "name": "string",
          "link": "string",
          "type": "Course | Video | Documentation | Practice | Project"
        }
      ],
      "tasks": [
        "string"
      ]
    }
  ],
  "totalTasks": 0
}
`;
    const bannedGoals = [
      "become batman",
      "destroy world",
      "time travel",
    ];

    if (bannedGoals.includes(goal.toLowerCase())) {
      return NextResponse.json({
        success: false,
        error: "Please enter a realistic career goal.",
      });
    }
    // ==============================
    // TRY OPENROUTER AI
    // ==============================
    try {
      console.log("🔄 Trying OpenRouter AI...");

      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            model: "openai/gpt-3.5-turbo",

            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],

            temperature: 0.7,
          }),
        }
      );

      console.log("📨 Status:", response.status);

      const data = await response.json();

      console.log("📦 OpenRouter Response:", data);

      const text = data?.choices?.[0]?.message?.content;

      if (!text) {
        throw new Error("No AI response text");
      }

      const cleaned = text.replace(/```json|```/g, "").trim();

      const roadmap = safeParseJSON(cleaned);

      if (!roadmap) {
        throw new Error("Invalid JSON from AI");
      }

      console.log("✅ AI roadmap generated successfully");

      return NextResponse.json({
        success: true,
        roadmap,
        provider: "openrouter-ai",
        fallback: false,
      });

    } catch (aiError) {
      console.error("❌ AI FAILED:", aiError);

      // ==============================
      // FALLBACK TO DEMO ROADMAP
      // ==============================
      console.log("⚠️ Switching to demo roadmap fallback...");

      const roadmap = getDemoRoadmap(body);

      return NextResponse.json({
        success: true,
        roadmap,
        provider: "demo-fallback",
        fallback: true,
      });
    }

  } catch (error) {
    console.error("❌ ROUTE ERROR:", error);

    // LAST SAFETY FALLBACK
    const roadmap = getDemoRoadmap({
      goal: "Career Growth",
      interest: "Technology",
    });

    return NextResponse.json({
      success: true,
      roadmap,
      provider: "emergency-fallback",
      fallback: true,
    });
  }
}