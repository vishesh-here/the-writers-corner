
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

const writingTopicsData = [
  {
    title: "Character Development",
    slug: "character-development",
    description: "Master the art of creating compelling, three-dimensional characters that drive your story forward.",
    exercises: [
      {
        title: "Character Foundation Blueprint",
        prompt: "Create a comprehensive character profile for your protagonist.",
        instructions: "Develop a character profile that includes: full name, age, physical appearance, background, personality traits, fears, desires, and a defining moment from their past. Write 500-750 words bringing this character to life through specific details and vivid descriptions."
      },
      {
        title: "Internal Conflict Excavation", 
        prompt: "Identify and explore your character's primary internal conflict.",
        instructions: "Write a 300-500 word analysis of your character's internal struggle. What do they want vs. what do they need? What beliefs or fears hold them back? How does this conflict manifest in their daily actions and decisions?"
      },
      {
        title: "Character Voice Discovery",
        prompt: "Develop your character's unique voice and speaking patterns.",
        instructions: "Write a 400-600 word monologue from your character's perspective about a significant childhood memory. Focus on their specific word choices, rhythm, dialect, and emotional expression. Make their voice so distinct that readers could identify them without dialogue tags."
      },
      {
        title: "Relationship Mapping",
        prompt: "Create a detailed relationship web for your character.",
        instructions: "Map out 5-7 key relationships in your character's life. For each person, write 100-150 words describing: their history together, current dynamic, what each character wants from the other, and how this relationship reveals different aspects of your protagonist's personality."
      },
      {
        title: "Character Arc Trajectory",
        prompt: "Plot your character's emotional and psychological journey.",
        instructions: "Create a character arc outline showing: who they are at the story's beginning, 3-4 key moments that challenge or change them, what they learn or realize, and who they become by the end. Write 200-250 words for each stage, focusing on internal transformation."
      },
      {
        title: "Behavioral Contradiction Exercise",
        prompt: "Explore the contradictions that make your character human.",
        instructions: "Write 3 scenes (200-300 words each) showing your character acting in seemingly contradictory ways. For example: a tough character showing vulnerability, a kind character being cruel, or a logical character being emotional. Explain the underlying motivations that make these contradictions believable."
      },
      {
        title: "Character Under Pressure",
        prompt: "Test your character's true nature through crisis.",
        instructions: "Write a 600-800 word scene where your character faces a significant crisis or moral dilemma. Show how they react under pressure, what choices they make, and what this reveals about their core values and true personality. Focus on authentic emotional responses and realistic decision-making."
      },
      {
        title: "Character Growth Catalyst",
        prompt: "Create a transformative moment for your character.",
        instructions: "Write a pivotal 500-700 word scene where your character experiences a breakthrough, revelation, or significant change. This should be a moment where they confront their fears, challenge their beliefs, or take action that moves them toward growth. Show the internal shift as well as external actions."
      }
    ]
  },
  {
    title: "Plot Structure", 
    slug: "plot-structure",
    description: "Learn to construct compelling narratives with perfect pacing and dramatic tension.",
    exercises: [
      {
        title: "Three-Act Foundation",
        prompt: "Outline your story using the classic three-act structure.",
        instructions: "Create a detailed outline: Act I (25%) - setup, character introduction, inciting incident; Act II (50%) - rising action, conflicts, midpoint twist; Act III (25%) - climax, resolution, denouement. Write 200-300 words per act, identifying key plot points and their emotional impact."
      },
      {
        title: "Inciting Incident Impact",
        prompt: "Craft a powerful story catalyst that launches your narrative.",
        instructions: "Write your story's inciting incident in 400-600 words. This moment should disrupt your protagonist's normal world and set the main plot in motion. Focus on immediate consequences, how it affects your character emotionally, and how it creates the story's central question or conflict."
      },
      {
        title: "Midpoint Reversal",
        prompt: "Create a game-changing moment at your story's center.",
        instructions: "Design and write your story's midpoint in 500-700 words. This should be a major revelation, plot twist, or character decision that completely changes the story's direction. Show how this moment shifts your protagonist's goal, raises the stakes, and propels them into the final act."
      },
      {
        title: "Subplot Integration",
        prompt: "Weave secondary storylines into your main narrative.",
        instructions: "Develop 2-3 subplots that support your main story. For each subplot, write 150-200 words describing: its connection to the main plot, how it develops your protagonist or other characters, its own mini arc, and how it resolves. Show how these storylines intersect and enhance the overall narrative."
      },
      {
        title: "Conflict Escalation Ladder",
        prompt: "Build rising tension through escalating conflicts.",
        instructions: "Create a series of 5-6 increasingly intense conflicts leading to your climax. For each conflict, write 100-150 words describing: the nature of the obstacle, what's at stake, how your protagonist responds, and how it leads to the next challenge. Show clear escalation in both external stakes and internal pressure."
      },
      {
        title: "Climax Construction",
        prompt: "Build your story's most crucial and intense moment.",
        instructions: "Write your story's climax in 600-800 words. This should be the moment of highest tension where your protagonist faces their greatest challenge. Include: the final confrontation, moment of truth, crucial decision, and immediate consequences. Make it feel like the inevitable result of everything that came before."
      },
      {
        title: "Scene Purpose Analysis",
        prompt: "Examine each scene's narrative function.",
        instructions: "Choose 5 key scenes from your story. For each scene, write 100-150 words analyzing: what plot information it reveals, how it advances character development, what conflict it introduces or resolves, how it raises or lowers tension, and why it's essential to the story. Identify what would be lost if the scene were removed."
      },
      {
        title: "Pacing Rhythm Map",
        prompt: "Master the flow and tempo of your narrative.",
        instructions: "Create a pacing map for your story showing: fast-paced action scenes, slow contemplative moments, dialogue-heavy sections, and description-rich passages. Write 50-100 words for each section explaining why you chose that pace and how it serves the story's emotional rhythm and reader engagement."
      }
    ]
  },
  {
    title: "World-Building",
    slug: "world-building", 
    description: "Construct immersive, believable worlds that enhance and support your story.",
    exercises: [
      {
        title: "Setting Foundation",
        prompt: "Establish the fundamental elements of your story world.",
        instructions: "Create a comprehensive overview of your story's setting. Include: geographical features, climate, time period, cultural elements, social structures, and technology level. Write 600-800 words focusing on how these elements directly impact your characters and plot. Consider how the setting itself becomes a character in your story."
      },
      {
        title: "Cultural Architecture",
        prompt: "Design the societies and customs of your world.",
        instructions: "Develop the cultural framework of your world by detailing: social hierarchies, belief systems, traditions, values, laws, and customs. Write 500-700 words showing how these cultural elements create conflict, opportunity, and meaning for your characters. Include specific examples of how culture manifests in daily life."
      },
      {
        title: "Sensory Landscape",
        prompt: "Bring your world to life through the five senses.",
        instructions: "Write 5 short passages (100-150 words each) describing the same location using different senses: sight, sound, smell, taste, and touch. Focus on unique sensory details that make your world distinct and memorable. Show how these sensory elements evoke emotion and create atmosphere."
      },
      {
        title: "Historical Depth",
        prompt: "Create a rich backstory that informs your present narrative.",
        instructions: "Develop your world's history by creating: 3-4 significant historical events, how they shaped current society, what legends or stories people tell about the past, and how history influences current conflicts. Write 200-250 words for each historical element, showing its relevance to your story."
      },
      {
        title: "Economic Ecosystem",
        prompt: "Design realistic economic and resource systems.",
        instructions: "Create the economic foundation of your world: what resources are valuable, how people make a living, what creates wealth or poverty, trade systems, and economic conflicts. Write 400-600 words showing how economic realities affect your characters' choices and create story opportunities."
      },
      {
        title: "Magic/Technology Rules",
        prompt: "Establish consistent rules for supernatural or advanced elements.",
        instructions: "If your world includes magic, advanced technology, or supernatural elements, create clear rules: how they work, what limits exist, who can use them, what costs are involved, and how they impact society. Write 500-700 words establishing these rules and their consequences."
      },
      {
        title: "Environmental Storytelling",
        prompt: "Use setting details to reveal character and plot information.",
        instructions: "Write 3 scenes (200-300 words each) where environmental details reveal important information about characters, history, or plot without explicit exposition. Show how a messy room reveals character traits, how architectural details hint at history, or how weather reflects emotional states."
      },
      {
        title: "World Contradiction Harmony",
        prompt: "Balance realism with fantastical elements seamlessly.", 
        instructions: "Identify 3-4 fantastical or unusual elements in your world. For each element, write 150-200 words explaining: how it coexists with realistic elements, what makes it believable within your world's logic, how characters react to it naturally, and why it's necessary for your story. Focus on internal consistency."
      }
    ]
  },
  {
    title: "Writing Tension",
    slug: "writing-tension",
    description: "Create gripping scenes that keep readers engaged through masterful tension techniques.",
    exercises: [
      {
        title: "Conflict Foundation",
        prompt: "Identify and develop the core conflicts driving your story.",
        instructions: "Analyze your story's conflicts across four levels: person vs. self (internal struggles), person vs. person (interpersonal conflicts), person vs. society (social/cultural conflicts), and person vs. nature/fate (external forces). Write 150-200 words for each level, showing how they interconnect and escalate throughout your narrative."
      },
      {
        title: "Stakes Escalation",
        prompt: "Raise the stakes progressively throughout your story.",
        instructions: "Create a stakes progression chart showing what your protagonist stands to lose or gain at each major story point. Write 100-150 words for each escalation level, demonstrating how consequences become more severe, personal, and meaningful. Show both external stakes (what happens in the world) and internal stakes (what happens to the character)."
      },
      {
        title: "Dramatic Irony Deployment",
        prompt: "Use reader knowledge to create tension and suspense.",
        instructions: "Write 3 scenes (250-350 words each) demonstrating different types of dramatic irony: readers know something characters don't, characters misunderstand a situation, and hidden character motivations. Show how this knowledge gap creates tension, emotional investment, and anticipation."
      },
      {
        title: "Pacing Manipulation",
        prompt: "Control story rhythm to maximize emotional impact.",
        instructions: "Write the same dramatic scene twice: once with fast pacing (short sentences, quick action) and once with slow pacing (longer sentences, detailed description). Each version should be 400-500 words. Analyze how pacing affects tension, emotion, and reader engagement."
      },
      {
        title: "Obstacle Amplification",
        prompt: "Create compelling barriers that challenge your protagonist.",
        instructions: "Design 5 obstacles of increasing difficulty that your protagonist must overcome. For each obstacle, write 100-150 words describing: the nature of the challenge, why it's specifically difficult for this character, what failure would cost, and how overcoming it requires growth or change."
      },
      {
        title: "Dialogue Tension",
        prompt: "Use conversation to create conflict and reveal character.",
        instructions: "Write a dialogue scene (500-700 words) where two characters want different things but neither can directly state their true desires. Use subtext, interruptions, what's not said, and emotional undercurrents to create tension. Include minimal dialogue tags, letting the words themselves carry the conflict."
      },
      {
        title: "Cliffhanger Crafting",
        prompt: "Master the art of compelling chapter endings.",
        instructions: "Write 5 different chapter endings (100-150 words each) using different cliffhanger techniques: revelation cliffhanger (shocking discovery), decision cliffhanger (character must choose), danger cliffhanger (physical threat), emotional cliffhanger (relationship crisis), and plot twist cliffhanger (unexpected development)."
      },
      {
        title: "Tension Sustainment",
        prompt: "Maintain reader engagement throughout quieter scenes.",
        instructions: "Write a 'quiet' scene (600-800 words) with no obvious external conflict - perhaps characters having dinner or traveling. Maintain tension through: unresolved underlying conflicts, hints of future problems, character internal struggles, or subtle environmental details. Show how tension doesn't require constant action."
      }
    ]
  }
]

const milestonesData = [
  // Week 1
  { title: "Foundation Setting", description: "Choose your story concept, genre, and main character. Complete character foundation exercises.", week: 1, order: 1 },
  
  // Week 2  
  { title: "Character Deep Dive", description: "Develop your protagonist's internal conflicts, relationships, and character arc.", week: 2, order: 2 },
  
  // Week 3
  { title: "Plot Structure Blueprint", description: "Create your three-act structure outline and identify key plot points.", week: 3, order: 3 },
  
  // Week 4
  { title: "World Building Basics", description: "Establish your story's setting, culture, and environmental elements.", week: 4, order: 4 },
  
  // Week 5
  { title: "Conflict Architecture", description: "Map out your story's central conflicts and tension points.", week: 5, order: 5 },
  
  // Week 6
  { title: "Scene Planning", description: "Plan your first 5-7 scenes with clear purposes and escalating tension.", week: 6, order: 6 },
  
  // Week 7
  { title: "First Draft - Opening", description: "Write your story's opening chapters focusing on character introduction and inciting incident.", week: 7, order: 7 },
  
  // Week 8
  { title: "First Draft - Rising Action", description: "Continue writing, developing conflicts and building toward your midpoint.", week: 8, order: 8 },
  
  // Week 9
  { title: "First Draft - Midpoint", description: "Write through your story's midpoint reversal and into the final act.", week: 9, order: 9 },
  
  // Week 10
  { title: "First Draft - Climax & Resolution", description: "Complete your first draft with a powerful climax and satisfying resolution.", week: 10, order: 10 },
  
  // Week 11
  { title: "Revision - Character & Plot", description: "Review and revise for character consistency and plot coherence.", week: 11, order: 11 },
  
  // Week 12
  { title: "Polish & Celebrate", description: "Final polish of your manuscript and celebrate completing your novel!", week: 12, order: 12 }
]

async function main() {
  console.log('Starting database seeding...')

  // Create test user
  const hashedPassword = await bcrypt.hash('johndoe123', 12)
  const testUser = await prisma.user.create({
    data: {
      firstName: 'John',
      lastName: 'Doe', 
      name: 'John Doe',
      email: 'john@doe.com',
      password: hashedPassword,
    }
  })
  console.log('✅ Test user created')

  // Create writing topics and exercises
  for (const topicData of writingTopicsData) {
    const { exercises, ...topicInfo } = topicData
    
    // Read topic content from the guide file
    const guideContent = fs.readFileSync(path.join(process.cwd(), 'data/novel_writing_guide.md'), 'utf-8')
    
    const topic = await prisma.writingTopic.create({
      data: {
        ...topicInfo,
        content: guideContent, // We'll extract specific sections in the actual implementation
        order: writingTopicsData.indexOf(topicData) + 1
      }
    })

    // Create exercises for this topic
    for (const exerciseData of exercises) {
      await prisma.exercise.create({
        data: {
          ...exerciseData,
          topicId: topic.id,
          order: exercises.indexOf(exerciseData) + 1
        }
      })
    }
    
    console.log(`✅ Created topic: ${topic.title} with ${exercises.length} exercises`)
  }

  // Create milestones
  for (const milestoneData of milestonesData) {
    await prisma.milestone.create({
      data: milestoneData
    })
  }
  console.log(`✅ Created ${milestonesData.length} milestones for 3-month roadmap`)

  console.log('🎉 Database seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
