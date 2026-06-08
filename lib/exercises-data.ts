import type { MuscleGroup } from '@/components/body-muscle-selector';

export interface Exercise {
  id: string;
  name: string;
  category: Exclude<MuscleGroup, 'All'>;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  equipment: string;
  icon: string;
  imageUrl?: string;
  animationUrl?: string;
  videoId: string;
  primaryMuscle: string;
  secondaryMuscles: string[];
  instructions: string[];
  durationEstimate: string;
}

export const exercises: Exercise[] = [
  // ═══════════════════ CHEST ═══════════════════
  {
    id: '1', name: 'Barbell Bench Press', category: 'Chest', difficulty: 'Intermediate',
    equipment: 'Barbell', icon: '🏋️',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/barbell-bench-press.gif',
    videoId: 'gRVjAtPip0Y',
    primaryMuscle: 'Pectoralis Major', secondaryMuscles: ['Triceps', 'Anterior Deltoids'],
    instructions: ['Lie flat on bench, feet planted', 'Grip bar slightly wider than shoulder-width', 'Lower bar to mid-chest with control', 'Press up explosively keeping elbows at 45°', 'Lock out without hyperextending'],
    durationEstimate: '40 sec / set'
  },
  {
    id: '2', name: 'Incline Dumbbell Press', category: 'Chest', difficulty: 'Intermediate',
    equipment: 'Dumbbells', icon: '📈',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/triceps/dumbbell-twisting-bench-press.gif',
    videoId: '8fXfwG4ftaQ',
    primaryMuscle: 'Upper Chest', secondaryMuscles: ['Anterior Deltoids', 'Triceps'],
    instructions: ['Set bench to 30-45° incline', 'Hold dumbbells at shoulders, palms forward', 'Press up until arms fully extended', 'Lower slowly feeling chest stretch', 'Keep shoulders packed throughout'],
    durationEstimate: '45 sec / set'
  },
  {
    id: '3', name: 'Decline Bench Press', category: 'Chest', difficulty: 'Advanced',
    equipment: 'Barbell', icon: '⬇️',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/smith-decline-bench-press.gif',
    videoId: 'a-UFQE4oxWY',
    primaryMuscle: 'Lower Chest', secondaryMuscles: ['Triceps', 'Anterior Deltoids'],
    instructions: ['Secure feet under pads on decline bench', 'Grip bar shoulder-width', 'Unrack and lower to lower chest', 'Press up keeping elbows tucked', 'Control the descent on each rep'],
    durationEstimate: '45 sec / set'
  },
  {
    id: '4', name: 'Dumbbell Flyes', category: 'Chest', difficulty: 'Beginner',
    equipment: 'Dumbbells', icon: '🦋',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/dumbbell-incline-twisted-flyes.gif',
    videoId: 'QENKPHhQVi4',
    primaryMuscle: 'Pectoralis Major', secondaryMuscles: ['Anterior Deltoids'],
    instructions: ['Lie on flat bench with dumbbells above chest', 'Slight bend in elbows throughout', 'Lower arms wide in an arc motion', 'Feel deep chest stretch at bottom', 'Squeeze chest to return to top'],
    durationEstimate: '50 sec / set'
  },
  {
    id: '5', name: 'Cable Crossover', category: 'Chest', difficulty: 'Intermediate',
    equipment: 'Cable', icon: '🔄',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/cable-one-arm-decline-chest-fly.gif',
    videoId: 'M97ra0UR-40',
    primaryMuscle: 'Pectoralis Major', secondaryMuscles: ['Anterior Deltoids'],
    instructions: ['Set pulleys to high position', 'Stand centered, grab each handle', 'Step forward, lean slightly', 'Pull handles down and across body', 'Squeeze chest at crossover point'],
    durationEstimate: '40 sec / set'
  },
  {
    id: '6', name: 'Push-Ups', category: 'Chest', difficulty: 'Beginner',
    equipment: 'Bodyweight', icon: '💪',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/push-up.gif',
    videoId: 'IODxDxX7oi4',
    primaryMuscle: 'Pectoralis Major', secondaryMuscles: ['Triceps', 'Core', 'Shoulders'],
    instructions: ['Start in plank, hands shoulder-width', 'Lower body until chest nears floor', 'Keep elbows at 45° to torso', 'Push through palms to extend arms', 'Maintain straight body line throughout'],
    durationEstimate: '30 sec / set'
  },
  {
    id: '7', name: 'Diamond Push-Ups', category: 'Chest', difficulty: 'Advanced',
    equipment: 'Bodyweight', icon: '💎',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/triceps/diamond-push-up.gif',
    videoId: 'PPTj-MW2tcs',
    primaryMuscle: 'Triceps', secondaryMuscles: ['Inner Chest', 'Core'],
    instructions: ['Form diamond shape with thumbs and index fingers', 'Position hands under chest', 'Lower body keeping elbows close', 'Push up explosively', 'Keep core tight throughout'],
    durationEstimate: '35 sec / set'
  },
  {
    id: '8', name: 'Chest Dip', category: 'Chest', difficulty: 'Advanced',
    equipment: 'Bodyweight', icon: '🔽',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/chest-dip.gif',
    videoId: 'CrbIq-T-h8I',
    primaryMuscle: 'Lower Chest', secondaryMuscles: ['Triceps', 'Shoulders'],
    instructions: ['Grip parallel bars, lift yourself up', 'Lean forward slightly', 'Lower body by bending elbows', 'Go until shoulders are below elbows', 'Push up to starting position'],
    durationEstimate: '40 sec / set'
  },
  {
    id: '9', name: 'Machine Chest Press', category: 'Chest', difficulty: 'Beginner',
    equipment: 'Machine', icon: '⚙️',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/lever-chest-press.gif',
    videoId: 'Qu7-ceCvq7w',
    primaryMuscle: 'Pectoralis Major', secondaryMuscles: ['Triceps'],
    instructions: ['Adjust seat so handles align with mid-chest', 'Grip handles, keep back flat', 'Press forward extending arms', 'Slowly return to start', 'Control weight throughout'],
    durationEstimate: '40 sec / set'
  },
  {
    id: '10', name: 'Pec Deck Fly', category: 'Chest', difficulty: 'Beginner',
    equipment: 'Machine', icon: '🔁',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/lever-seated-fly.gif',
    videoId: 'a9vQ_hwIksU',
    primaryMuscle: 'Pectoralis Major', secondaryMuscles: ['Anterior Deltoids'],
    instructions: ['Adjust seat, arms at 90° with pads', 'Press forearms together in front', 'Squeeze chest at peak contraction', 'Slowly open arms to stretch', 'Keep back flat against pad'],
    durationEstimate: '45 sec / set'
  },
  {
    id: '11', name: 'Floor Press', category: 'Chest', difficulty: 'Intermediate',
    equipment: 'Barbell', icon: '🛏️',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/kettlebell-one-arm-floor-press.gif',
    videoId: 'UBmpZ7l5Nlk',
    primaryMuscle: 'Triceps', secondaryMuscles: ['Chest', 'Shoulders'],
    instructions: ['Lie on floor with barbell on rack', 'Grip slightly narrower than bench', 'Unrack and lower until elbows touch floor', 'Pause then press up', 'Great for tricep overload'],
    durationEstimate: '40 sec / set'
  },
  {
    id: '12', name: 'Svend Press', category: 'Chest', difficulty: 'Beginner',
    equipment: 'Plate', icon: '🤲',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/weighted-svend-press.gif',
    videoId: 'cIoUZOnypS8',
    primaryMuscle: 'Inner Chest', secondaryMuscles: ['Triceps'],
    instructions: ['Hold a plate at chest level with palms together', 'Squeeze plate as hard as possible', 'Press plate straight out', 'Squeeze chest at full extension', 'Return slowly to chest'],
    durationEstimate: '35 sec / set'
  },
  {
    id: '13', name: 'Incline Fly', category: 'Chest', difficulty: 'Intermediate',
    equipment: 'Dumbbells', icon: '📐',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/dumbbell-incline-fly.gif',
    videoId: 'kIpagzRxFPo',
    primaryMuscle: 'Upper Chest', secondaryMuscles: ['Anterior Deltoids'],
    instructions: ['Incline bench to 30°, dumbbells above shoulders', 'Soft bend in elbows', 'Lower arms wide in arc', 'Stretch deep at bottom', 'Squeeze up to top'],
    durationEstimate: '50 sec / set'
  },
  {
    id: '14', name: 'Close-Grip Bench Press', category: 'Chest', difficulty: 'Intermediate',
    equipment: 'Barbell', icon: '📏',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/smith-bench-press.gif',
    videoId: 'xXd7sddHGa0',
    primaryMuscle: 'Triceps', secondaryMuscles: ['Inner Chest', 'Shoulders'],
    instructions: ['Lie on bench, grip bar hands together', 'Keep elbows tight to body', 'Lower bar to lower chest', 'Press up focusing on triceps', 'Lock out at top'],
    durationEstimate: '40 sec / set'
  },

  // ═══════════════════ BACK ═══════════════════
  {
    id: '15', name: 'Deadlift', category: 'Back', difficulty: 'Advanced',
    equipment: 'Barbell', icon: '🏋️',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/smith-deadlift.gif',
    videoId: 'op9kVnSso6Q',
    primaryMuscle: 'Erector Spinae', secondaryMuscles: ['Hamstrings', 'Glutes', 'Lats', 'Core'],
    instructions: ['Feet under bar mid-foot', 'Hinge and grip shoulder-width', 'Bend knees till shins touch bar', 'Keep back flat, drive hips forward', 'Stand tall, lower slowly'],
    durationEstimate: '30 sec / set'
  },
  {
    id: '16', name: 'Pull-Ups', category: 'Back', difficulty: 'Advanced',
    equipment: 'Bodyweight', icon: '🦇',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/lats/pull-up.gif',
    videoId: 'eGo4IYlbE5g',
    primaryMuscle: 'Latissimus Dorsi', secondaryMuscles: ['Biceps', 'Rhomboids', 'Rear Deltoids'],
    instructions: ['Grip bar wider than shoulders', 'Hang with full extension', 'Pull shoulders back and down', 'Drive elbows to raise chin over bar', 'Lower with control'],
    durationEstimate: '35 sec / set'
  },
  {
    id: '17', name: 'Chin-Ups', category: 'Back', difficulty: 'Intermediate',
    equipment: 'Bodyweight', icon: '🦎',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/lats/assisted-standing-chin-up.gif',
    videoId: 'Oi3bW9nQmGI',
    primaryMuscle: 'Latissimus Dorsi', secondaryMuscles: ['Biceps', 'Core'],
    instructions: ['Grip bar shoulder-width palms facing you', 'Hang fully extended', 'Pull chin to bar using back', 'Squeeze at top', 'Lower with control'],
    durationEstimate: '35 sec / set'
  },
  {
    id: '18', name: 'Barbell Row', category: 'Back', difficulty: 'Intermediate',
    equipment: 'Barbell', icon: '↔️',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/upper-back/barbell-reverse-grip-incline-bench-row.gif',
    videoId: 'Nqh7q3zDCoQ',
    primaryMuscle: 'Latissimus Dorsi', secondaryMuscles: ['Rhomboids', 'Traps', 'Biceps'],
    instructions: ['Hinge at hips, torso near parallel', 'Grip bar shoulder-width', 'Pull bar to lower ribcage', 'Squeeze back muscles', 'Lower bar with control'],
    durationEstimate: '40 sec / set'
  },
  {
    id: '19', name: 'Dumbbell Row', category: 'Back', difficulty: 'Intermediate',
    equipment: 'Dumbbells', icon: '⛵',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/upper-back/dumbbell-reverse-grip-incline-bench-two-arm-row.gif',
    videoId: 'gfUg6qWohTk',
    primaryMuscle: 'Latissimus Dorsi', secondaryMuscles: ['Rhomboids', 'Biceps', 'Rear Deltoids'],
    instructions: ['Place knee and hand on bench', 'Hold dumbbell with other hand', 'Pull dumbbell to hip', 'Squeeze lat at top', 'Lower under control'],
    durationEstimate: '40 sec / set'
  },
  {
    id: '20', name: 'T-Bar Row', category: 'Back', difficulty: 'Advanced',
    equipment: 'Barbell', icon: '🔧',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/upper-back/lever-reverse-t-bar-row.gif',
    videoId: 'TyLoy3n_a10',
    primaryMuscle: 'Middle Back', secondaryMuscles: ['Lats', 'Rhomboids', 'Biceps'],
    instructions: ['Straddle bar with T-bar handle', 'Hinge at hips, back straight', 'Pull bar toward chest', 'Squeeze mid-back at top', 'Lower slowly'],
    durationEstimate: '45 sec / set'
  },
  {
    id: '21', name: 'Lat Pulldown', category: 'Back', difficulty: 'Beginner',
    equipment: 'Cable', icon: '⬇️',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/lats/cable-lat-pulldown-full-range-of-motion.gif',
    videoId: 'bNmvKpJSWKM',
    primaryMuscle: 'Latissimus Dorsi', secondaryMuscles: ['Biceps', 'Rhomboids'],
    instructions: ['Grip bar wider than shoulders', 'Sit, thighs under pads', 'Pull bar to upper chest', 'Lean back slightly, squeeze lats', 'Return with control'],
    durationEstimate: '40 sec / set'
  },
  {
    id: '22', name: 'Seated Cable Row', category: 'Back', difficulty: 'Beginner',
    equipment: 'Cable', icon: '➡️',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/upper-back/cable-upper-row.gif',
    videoId: 'vwHG9Jfu4sw',
    primaryMuscle: 'Middle Back', secondaryMuscles: ['Lats', 'Biceps', 'Rear Deltoids'],
    instructions: ['Sit with feet braced', 'Grip handle, back straight', 'Pull handle to stomach', 'Squeeze shoulder blades', 'Extend arms forward slowly'],
    durationEstimate: '40 sec / set'
  },
  {
    id: '23', name: 'Straight-Arm Pulldown', category: 'Back', difficulty: 'Intermediate',
    equipment: 'Cable', icon: '📏',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/lats/cable-pulldown.gif',
    videoId: 'hAMcfubonDc',
    primaryMuscle: 'Latissimus Dorsi', secondaryMuscles: ['Triceps', 'Core'],
    instructions: ['Grip bar with straight arms', 'Lean forward slightly', 'Pull bar down to thighs', 'Keep arms straight throughout', 'Squeeze lats at bottom'],
    durationEstimate: '35 sec / set'
  },
  {
    id: '24', name: 'Face Pull', category: 'Back', difficulty: 'Beginner',
    equipment: 'Cable', icon: '👤',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/cable-standing-rear-delt-row-with-rope.gif',
    videoId: 'IeOqdw9WI90',
    primaryMuscle: 'Rear Deltoids', secondaryMuscles: ['Traps', 'Rhomboids'],
    instructions: ['Set pulley at upper chest height', 'Grip with both hands', 'Pull rope toward face', 'Externally rotate shoulders', 'Squeeze rear delts'],
    durationEstimate: '35 sec / set'
  },
  {
    id: '25', name: 'Barbell Shrug', category: 'Back', difficulty: 'Beginner',
    equipment: 'Barbell', icon: '⬆️',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/traps/barbell-shrug.gif',
    videoId: 'MlqHEfydPpE',
    primaryMuscle: 'Traps', secondaryMuscles: ['Shoulders'],
    instructions: ['Hold barbell at hip level', 'Stand tall with shoulders back', 'Shrug shoulders straight up', 'Hold peak contraction', 'Lower slowly'],
    durationEstimate: '30 sec / set'
  },
  {
    id: '26', name: 'Inverted Row', category: 'Back', difficulty: 'Beginner',
    equipment: 'Bodyweight', icon: '↩️',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/upper-back/inverted-row.gif',
    videoId: 'hXTc1mDnZCw',
    primaryMuscle: 'Middle Back', secondaryMuscles: ['Biceps', 'Rear Deltoids'],
    instructions: ['Set bar at hip height', 'Hang under bar with straight body', 'Pull chest to bar', 'Squeeze back at top', 'Lower with control'],
    durationEstimate: '35 sec / set'
  },
  {
    id: '27', name: 'Back Extension', category: 'Back', difficulty: 'Beginner',
    equipment: 'Bodyweight', icon: '⬅️',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/spine/lever-back-extension.gif',
    videoId: 'Wpreb69h2fE',
    primaryMuscle: 'Erector Spinae', secondaryMuscles: ['Glutes', 'Hamstrings'],
    instructions: ['Position in hyperextension bench', 'Cross arms over chest', 'Lower torso toward floor', 'Extend back to straight line', 'Squeeze lower back at top'],
    durationEstimate: '40 sec / set'
  },
  {
    id: '28', name: 'Renegade Row', category: 'Back', difficulty: 'Advanced',
    equipment: 'Dumbbells', icon: '🏴‍☠️',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/upper-back/kettlebell-alternating-renegade-row.gif',
    videoId: '4qEIChzM4ZA',
    primaryMuscle: 'Latissimus Dorsi', secondaryMuscles: ['Core', 'Shoulders', 'Biceps'],
    instructions: ['Start in plank on dumbbells', 'Row one dumbbell to hip', 'Keep hips stable', 'Lower and repeat other side', 'Alternate each rep'],
    durationEstimate: '45 sec / set'
  },

  // ═══════════════════ LEGS ═══════════════════
  {
    id: '29', name: 'Barbell Squat', category: 'Legs', difficulty: 'Intermediate',
    equipment: 'Barbell', icon: '🦵',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/quads/barbell-wide-squat.gif',
    videoId: 'ultWZbUMPL8',
    primaryMuscle: 'Quadriceps', secondaryMuscles: ['Glutes', 'Hamstrings', 'Core'],
    instructions: ['Bar on upper back, grip firm', 'Feet shoulder-width, toes slightly out', 'Hinge hips back and down', 'Descend until thighs parallel', 'Drive through heels to stand'],
    durationEstimate: '45 sec / set'
  },
  {
    id: '30', name: 'Front Squat', category: 'Legs', difficulty: 'Advanced',
    equipment: 'Barbell', icon: '🏆',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/kettlebell-front-squat.gif',
    videoId: 'v-mQm_droHg',
    primaryMuscle: 'Quadriceps', secondaryMuscles: ['Glutes', 'Core', 'Upper Back'],
    instructions: ['Bar across front of shoulders', 'Elbows high, fingers supporting', 'Squat down keeping torso upright', 'Descend to parallel or below', 'Drive up through heels'],
    durationEstimate: '45 sec / set'
  },
  {
    id: '31', name: 'Goblet Squat', category: 'Legs', difficulty: 'Beginner',
    equipment: 'Kettlebell', icon: '🏺',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/quads/dumbbell-goblet-squat.gif',
    videoId: 'lRYBbchqxtI',
    primaryMuscle: 'Quadriceps', secondaryMuscles: ['Glutes', 'Core', 'Hamstrings'],
    instructions: ['Hold kettlebell at chest', 'Feet wider than shoulders', 'Squat down keeping bell at chest', 'Elbows between knees at bottom', 'Drive up through heels'],
    durationEstimate: '40 sec / set'
  },
  {
    id: '32', name: 'Bulgarian Split Squat', category: 'Legs', difficulty: 'Intermediate',
    equipment: 'Dumbbells', icon: '🇧🇬',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/quads/band-one-arm-single-leg-split-squat.gif',
    videoId: 'or1frhkjBDc',
    primaryMuscle: 'Quadriceps', secondaryMuscles: ['Glutes', 'Hamstrings', 'Core'],
    instructions: ['Place rear foot on bench', 'Hold dumbbells at sides', 'Lower back knee toward floor', 'Front thigh parallel at bottom', 'Drive through front heel to stand'],
    durationEstimate: '45 sec / set'
  },
  {
    id: '33', name: 'Leg Press', category: 'Legs', difficulty: 'Beginner',
    equipment: 'Machine', icon: '🦿',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/smith-leg-press.gif',
    videoId: 'sEM_zo9w2ss',
    primaryMuscle: 'Quadriceps', secondaryMuscles: ['Glutes', 'Hamstrings'],
    instructions: ['Sit in machine, feet shoulder-width', 'Unrack safety handles', 'Lower until knees at 90°', 'Press through heels extending legs', 'Do not lock knees at top'],
    durationEstimate: '40 sec / set'
  },
  {
    id: '34', name: 'Leg Extension', category: 'Legs', difficulty: 'Beginner',
    equipment: 'Machine', icon: '🔝',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/quads/resistance-band-leg-extension.gif',
    videoId: '0fl1RRgJ83I',
    primaryMuscle: 'Quadriceps', secondaryMuscles: [],
    instructions: ['Sit in leg extension machine', 'Pads above ankles', 'Extend legs until straight', 'Squeeze quads at top', 'Lower with slow control'],
    durationEstimate: '35 sec / set'
  },
  {
    id: '35', name: 'Leg Curl', category: 'Legs', difficulty: 'Beginner',
    equipment: 'Machine', icon: '🌀',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/biceps/cable-curl.gif',
    videoId: '_lgE0gPvbik',
    primaryMuscle: 'Hamstrings', secondaryMuscles: ['Glutes', 'Calves'],
    instructions: ['Lie face down on leg curl machine', 'Pads behind ankles', 'Curl legs toward glutes', 'Squeeze hamstrings at peak', 'Lower controlled'],
    durationEstimate: '35 sec / set'
  },
  {
    id: '36', name: 'Romanian Deadlift', category: 'Legs', difficulty: 'Intermediate',
    equipment: 'Barbell', icon: '⚡',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/dumbbell-romanian-deadlift.gif',
    videoId: 'JCXUYuzwNrM',
    primaryMuscle: 'Hamstrings', secondaryMuscles: ['Glutes', 'Lower Back', 'Core'],
    instructions: ['Hip-width stance, bar at hip', 'Hinge forward pushing hips back', 'Soft knees, bar slides down shins', 'Feel deep hamstring stretch', 'Squeeze glutes to return'],
    durationEstimate: '45 sec / set'
  },
  {
    id: '37', name: 'Walking Lunge', category: 'Legs', difficulty: 'Beginner',
    equipment: 'Dumbbells', icon: '🚶',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/walking-lunge.gif',
    videoId: 'uRSsOoZG9z8',
    primaryMuscle: 'Quadriceps', secondaryMuscles: ['Glutes', 'Hamstrings', 'Core'],
    instructions: ['Hold dumbbells at sides', 'Step forward with one leg', 'Lower back knee toward floor', 'Front thigh parallel to ground', 'Push off and step forward with other leg'],
    durationEstimate: '40 sec / set'
  },
  {
    id: '38', name: 'Reverse Lunge', category: 'Legs', difficulty: 'Beginner',
    equipment: 'Dumbbells', icon: '↩️',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/dumbbell-lunge.gif',
    videoId: 'Ix9QZ3Pnneo',
    primaryMuscle: 'Quadriceps', secondaryMuscles: ['Glutes', 'Hamstrings'],
    instructions: ['Stand with dumbbells at sides', 'Step backward with one leg', 'Lower back knee toward floor', 'Front thigh parallel at bottom', 'Drive through front heel to return'],
    durationEstimate: '40 sec / set'
  },
  {
    id: '39', name: 'Step-Up', category: 'Legs', difficulty: 'Beginner',
    equipment: 'Dumbbells', icon: '🪜',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/dumbbell-step-up.gif',
    videoId: '90-X4kqhY3E',
    primaryMuscle: 'Quadriceps', secondaryMuscles: ['Glutes', 'Hamstrings'],
    instructions: ['Stand before a sturdy bench/box', 'Hold dumbbells at sides', 'Step onto box with one foot', 'Drive through heel to stand on box', 'Step down and repeat'],
    durationEstimate: '40 sec / set'
  },
  {
    id: '40', name: 'Hip Thrust', category: 'Legs', difficulty: 'Intermediate',
    equipment: 'Barbell', icon: '🫃',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/barbell-lying-lifting-on-hip.gif',
    videoId: 'SEdqd1n0cvg',
    primaryMuscle: 'Glutes', secondaryMuscles: ['Hamstrings', 'Core'],
    instructions: ['Sit on floor, upper back on bench', 'Bar across hips', 'Drive hips up squeezing glutes', 'Hold peak contraction', 'Lower with control'],
    durationEstimate: '45 sec / set'
  },
  {
    id: '41', name: 'Glute Bridge', category: 'Legs', difficulty: 'Beginner',
    equipment: 'Bodyweight', icon: '🌉',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/barbell-glute-bridge.gif',
    videoId: 'OUgsJ8-Vi0E',
    primaryMuscle: 'Glutes', secondaryMuscles: ['Hamstrings', 'Core'],
    instructions: ['Lie on back, knees bent', 'Feet flat on floor', 'Drive hips upward', 'Squeeze glutes at top', 'Lower slowly'],
    durationEstimate: '30 sec / set'
  },
  {
    id: '42', name: 'Standing Calf Raise', category: 'Legs', difficulty: 'Beginner',
    equipment: 'Bodyweight', icon: '🦶',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/calves/lever-standing-calf-raise.gif',
    videoId: 'n-5T_oYc1oU',
    primaryMuscle: 'Gastrocnemius', secondaryMuscles: ['Soleus'],
    instructions: ['Stand with feet shoulder-width', 'Raise heels off ground', 'Pause at top', 'Lower heels below parallel', 'Feel full range of motion'],
    durationEstimate: '30 sec / set'
  },
  {
    id: '43', name: 'Seated Calf Raise', category: 'Legs', difficulty: 'Beginner',
    equipment: 'Machine', icon: '💺',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/calves/lever-seated-calf-raise.gif',
    videoId: 'Yh5TXz99xwY',
    primaryMuscle: 'Soleus', secondaryMuscles: ['Gastrocnemius'],
    instructions: ['Sit in calf raise machine', 'Pads on knees', 'Raise heels extending ankles', 'Pause at top contraction', 'Lower heels below start'],
    durationEstimate: '35 sec / set'
  },
  {
    id: '44', name: 'Box Jump', category: 'Legs', difficulty: 'Advanced',
    equipment: 'Bodyweight', icon: '📦',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/calves/box-jump-down-with-one-leg-stabilization.gif',
    videoId: 'HJZh-12p6vg',
    primaryMuscle: 'Quadriceps', secondaryMuscles: ['Glutes', 'Calves', 'Core'],
    instructions: ['Stand facing sturdy box', 'Slight squat then explode up', 'Land softly on box', 'Stand upright on box', 'Step down carefully'],
    durationEstimate: '5 reps'
  },
  {
    id: '45', name: 'Sumo Squat', category: 'Legs', difficulty: 'Beginner',
    equipment: 'Dumbbells', icon: '🔛',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/smith-sumo-squat.gif',
    videoId: 'MsxLG_ZEoOQ',
    primaryMuscle: 'Inner Thighs', secondaryMuscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
    instructions: ['Wide stance, toes pointed out', 'Hold dumbbell in goblet position', 'Squat down keeping chest up', 'Knees track over toes', 'Drive through heels to stand'],
    durationEstimate: '40 sec / set'
  },
  {
    id: '46', name: 'Wall Sit', category: 'Legs', difficulty: 'Beginner',
    equipment: 'Bodyweight', icon: '🧱',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/march-sit-wall.gif',
    videoId: 'cWTZ8Am1Ee0',
    primaryMuscle: 'Quadriceps', secondaryMuscles: ['Glutes', 'Core'],
    instructions: ['Stand with back against wall', 'Slide down until thighs parallel', 'Hold position', 'Keep core engaged', 'Hold for time'],
    durationEstimate: '30-60 sec hold'
  },

  // ═══════════════════ SHOULDERS ═══════════════════
  {
    id: '47', name: 'Overhead Press', category: 'Shoulders', difficulty: 'Intermediate',
    equipment: 'Barbell', icon: '☄️',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/barbell-seated-overhead-press.gif',
    videoId: 'B-aVuyhvLHU',
    primaryMuscle: 'Deltoids', secondaryMuscles: ['Triceps', 'Upper Chest', 'Core'],
    instructions: ['Bar at collarbone, standard grip', 'Squeeze glutes and brace core', 'Press bar straight up', 'Clear face, then push head forward', 'Lock out overhead, lower controlled'],
    durationEstimate: '45 sec / set'
  },
  {
    id: '48', name: 'Arnold Press', category: 'Shoulders', difficulty: 'Intermediate',
    equipment: 'Dumbbells', icon: '🔄',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/kettlebell-arnold-press.gif',
    videoId: 'hmnZKRpYaV8',
    primaryMuscle: 'Deltoids', secondaryMuscles: ['Triceps', 'Upper Chest'],
    instructions: ['Hold dumbbells at shoulders, palms facing you', 'Press up while rotating palms forward', 'Rotate at the top', 'Reverse rotation on the way down', 'Full range of motion'],
    durationEstimate: '45 sec / set'
  },
  {
    id: '49', name: 'Lateral Raise', category: 'Shoulders', difficulty: 'Beginner',
    equipment: 'Dumbbells', icon: '📡',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/lever-lateral-raise.gif',
    videoId: 'qJITWU51Uxs',
    primaryMuscle: 'Lateral Deltoid', secondaryMuscles: ['Traps'],
    instructions: ['Stand with dumbbells at sides', 'Slight lean forward', 'Raise arms to shoulder height', 'Lead with elbows', 'Lower with control'],
    durationEstimate: '35 sec / set'
  },
  {
    id: '50', name: 'Front Raise', category: 'Shoulders', difficulty: 'Beginner',
    equipment: 'Dumbbells', icon: '⬆️',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/weighted-front-raise.gif',
    videoId: 'lhV2-z6s_bI',
    primaryMuscle: 'Anterior Deltoid', secondaryMuscles: ['Upper Chest'],
    instructions: ['Dumbbells in front of thighs', 'Raise arms forward to shoulder height', 'Keep slight bend in elbows', 'Pause at top', 'Lower controlled'],
    durationEstimate: '35 sec / set'
  },
  {
    id: '51', name: 'Reverse Fly', category: 'Shoulders', difficulty: 'Beginner',
    equipment: 'Dumbbells', icon: '🔙',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/dumbbell-reverse-fly.gif',
    videoId: 'b9YUtRP184o',
    primaryMuscle: 'Posterior Deltoid', secondaryMuscles: ['Rhomboids', 'Traps'],
    instructions: ['Hinge forward, dumbbells below chest', 'Arms slightly bent', 'Raise arms outward squeezing shoulders back', 'Squeeze rear delts at top', 'Lower controlled'],
    durationEstimate: '40 sec / set'
  },
  {
    id: '52', name: 'Upright Row', category: 'Shoulders', difficulty: 'Intermediate',
    equipment: 'Barbell', icon: '⬆️',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/smith-upright-row.gif',
    videoId: 'U-KG4oahSLA',
    primaryMuscle: 'Traps', secondaryMuscles: ['Deltoids', 'Biceps'],
    instructions: ['Grip bar with hands close', 'Pull bar up along body', 'Lead with elbows above hands', 'Bar reaches chin level', 'Lower controlled'],
    durationEstimate: '35 sec / set'
  },
  {
    id: '53', name: 'Push Press', category: 'Shoulders', difficulty: 'Advanced',
    equipment: 'Barbell', icon: '💥',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/dumbbell-push-press.gif',
    videoId: 'ha-VpsTXNjU',
    primaryMuscle: 'Deltoids', secondaryMuscles: ['Triceps', 'Quads', 'Core'],
    instructions: ['Bar at shoulders, slight dip in knees', 'Explode up using legs', 'Press bar overhead', 'Lock out', 'Lower to shoulders'],
    durationEstimate: '40 sec / set'
  },
  {
    id: '54', name: 'Landmine Press', category: 'Shoulders', difficulty: 'Beginner',
    equipment: 'Barbell', icon: '💣',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/landmine-180.gif',
    videoId: 't9GuiNQo1O4',
    primaryMuscle: 'Anterior Deltoid', secondaryMuscles: ['Triceps', 'Core'],
    instructions: ['Position bar in landmine attachment', 'Grip end of bar at shoulder', 'Press bar upward and slightly forward', 'Full extension at top', 'Lower with control'],
    durationEstimate: '40 sec / set'
  },
  {
    id: '55', name: 'Plate Front Raise', category: 'Shoulders', difficulty: 'Beginner',
    equipment: 'Plate', icon: '🛡️',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/weighted-front-raise.gif',
    videoId: 'yHQi_GUNc5o',
    primaryMuscle: 'Anterior Deltoid', secondaryMuscles: ['Upper Chest'],
    instructions: ['Hold plate with both hands at thighs', 'Raise plate to shoulder height', 'Keep arms straight', 'Pause at top', 'Lower controlled'],
    durationEstimate: '35 sec / set'
  },
  {
    id: '56', name: 'Cable Lateral Raise', category: 'Shoulders', difficulty: 'Intermediate',
    equipment: 'Cable', icon: '🪢',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/cable-lateral-raise.gif',
    videoId: 'Fv-eAW1uKDI',
    primaryMuscle: 'Lateral Deltoid', secondaryMuscles: ['Traps'],
    instructions: ['Stand sideways to cable machine', 'Grab handle with outside hand', 'Raise arm to shoulder height', 'Keep slight bend in elbow', 'Lower with control'],
    durationEstimate: '35 sec / set'
  },

  // ═══════════════════ ARMS ═══════════════════
  {
    id: '57', name: 'Barbell Curl', category: 'Arms', difficulty: 'Beginner',
    equipment: 'Barbell', icon: '💪',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/forearms/barbell-wrist-curl.gif',
    videoId: 'kwG2ipFRgfo',
    primaryMuscle: 'Biceps Brachii', secondaryMuscles: ['Forearms'],
    instructions: ['Hold bar with underhand grip', 'Elbows tucked to sides', 'Curl bar toward shoulders', 'Squeeze biceps at top', 'Lower with control'],
    durationEstimate: '35 sec / set'
  },
  {
    id: '58', name: 'Dumbbell Hammer Curl', category: 'Arms', difficulty: 'Beginner',
    equipment: 'Dumbbells', icon: '🔨',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/biceps/dumbbell-hammer-curl.gif',
    videoId: 'zC3nLlEvin4',
    primaryMuscle: 'Brachioradialis', secondaryMuscles: ['Biceps Brachii', 'Forearms'],
    instructions: ['Neutral grip palms facing each other', 'Elbows locked to torso', 'Curl dumbbells up', 'Squeeze forearms and biceps', 'Lower fully'],
    durationEstimate: '40 sec / set'
  },
  {
    id: '59', name: 'Preacher Curl', category: 'Arms', difficulty: 'Intermediate',
    equipment: 'EZ Bar', icon: '⛪',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/biceps/lever-preacher-curl.gif',
    videoId: 'pwEhS1sg9mU',
    primaryMuscle: 'Biceps Brachii', secondaryMuscles: ['Forearms'],
    instructions: ['Sit at preacher bench, arms on pad', 'Grip EZ bar underhand', 'Curl bar toward shoulders', 'Squeeze biceps at top', 'Lower controlled without hyperextending'],
    durationEstimate: '40 sec / set'
  },
  {
    id: '60', name: 'Concentration Curl', category: 'Arms', difficulty: 'Beginner',
    equipment: 'Dumbbells', icon: '🎯',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/biceps/dumbbell-concentration-curl.gif',
    videoId: 'LHDwya1KY8M',
    primaryMuscle: 'Biceps Brachii', secondaryMuscles: ['Forearms'],
    instructions: ['Sit on bench, legs apart', 'Arm against inner thigh', 'Curl dumbbell toward chest', 'Squeeze hard at top', 'Lower slowly'],
    durationEstimate: '35 sec / set'
  },
  {
    id: '61', name: 'Cable Curl', category: 'Arms', difficulty: 'Beginner',
    equipment: 'Cable', icon: '🪢',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/hamstrings/cable-assisted-inverse-leg-curl.gif',
    videoId: 'ctR8tpErPNA',
    primaryMuscle: 'Biceps Brachii', secondaryMuscles: ['Forearms'],
    instructions: ['Stand at cable with straight bar', 'Elbows pinned to sides', 'Curl bar toward shoulders', 'Squeeze biceps at peak', 'Lower with slow release'],
    durationEstimate: '35 sec / set'
  },
  {
    id: '62', name: 'Incline Dumbbell Curl', category: 'Arms', difficulty: 'Intermediate',
    equipment: 'Dumbbells', icon: '📐',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/forearms/dumbbell-seated-palms-up-wrist-curl.gif',
    videoId: 'UeleXjsE-98',
    primaryMuscle: 'Biceps Brachii', secondaryMuscles: ['Forearms'],
    instructions: ['Lie back on incline bench', 'Dumbbells hang at sides', 'Curl weights toward shoulders', 'Keep upper arms still', 'Squeeze at top'],
    durationEstimate: '40 sec / set'
  },
  {
    id: '63', name: 'Tricep Pushdown', category: 'Arms', difficulty: 'Beginner',
    equipment: 'Cable', icon: '⬇️',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/triceps/cable-pushdown.gif',
    videoId: 'mpZ9VRisAyw',
    primaryMuscle: 'Triceps Brachii', secondaryMuscles: [],
    instructions: ['Stand at cable with rope/bar', 'Elbows bent at 90°', 'Push down until arms extend', 'Squeeze triceps at bottom', 'Return with control'],
    durationEstimate: '35 sec / set'
  },
  {
    id: '64', name: 'Overhead Tricep Extension', category: 'Arms', difficulty: 'Intermediate',
    equipment: 'Dumbbells', icon: '☝️',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/triceps/barbell-seated-overhead-triceps-extension.gif',
    videoId: 'NRENeEgaIgA',
    primaryMuscle: 'Triceps Brachii', secondaryMuscles: ['Shoulders'],
    instructions: ['Hold one dumbbell overhead with both hands', 'Lower dumbbell behind head', 'Keep elbows pointing up', 'Extend arms back overhead', 'Squeeze triceps at top'],
    durationEstimate: '40 sec / set'
  },
  {
    id: '65', name: 'Skull Crusher', category: 'Arms', difficulty: 'Advanced',
    equipment: 'EZ Bar', icon: '💀',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/triceps/barbell-lying-triceps-extension-skull-crusher.gif',
    videoId: 'K6MSN4hCDM4',
    primaryMuscle: 'Triceps Brachii', secondaryMuscles: ['Chest'],
    instructions: ['Lie on bench holding EZ bar above chest', 'Lower bar toward forehead', 'Elbows stay fixed pointing up', 'Extend arms back to start', 'Do not bounce at bottom'],
    durationEstimate: '40 sec / set'
  },
  {
    id: '66', name: 'Tricep Dip', category: 'Arms', difficulty: 'Intermediate',
    equipment: 'Bodyweight', icon: '🔽',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/triceps/reverse-dip.gif',
    videoId: 'ZQnPQG5d67E',
    primaryMuscle: 'Triceps Brachii', secondaryMuscles: ['Chest', 'Shoulders'],
    instructions: ['Grip edge of sturdy bench/chair', 'Walk feet out, arms supporting', 'Lower body by bending elbows', 'Go to 90°, keep back close', 'Push up to start'],
    durationEstimate: '35 sec / set'
  },
  {
    id: '67', name: 'Tricep Kickback', category: 'Arms', difficulty: 'Beginner',
    equipment: 'Dumbbells', icon: '🦵',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/triceps/dumbbell-kickback.gif',
    videoId: 'BL9CzOQZDrs',
    primaryMuscle: 'Triceps Brachii', secondaryMuscles: [],
    instructions: ['Hinge forward with dumbbell', 'Arm parallel to ground', 'Extend arm straight back', 'Squeeze triceps at peak', 'Return slowly'],
    durationEstimate: '35 sec / set'
  },
  {
    id: '68', name: 'Reverse Curl', category: 'Arms', difficulty: 'Intermediate',
    equipment: 'EZ Bar', icon: '↩️',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/biceps/cable-reverse-curl.gif',
    videoId: 'i5h3myNHVFk',
    primaryMuscle: 'Brachioradialis', secondaryMuscles: ['Biceps', 'Forearms'],
    instructions: ['Overhand grip on EZ bar', 'Elbows at sides', 'Curl bar toward shoulders', 'Squeeze forearm muscles', 'Lower controlled'],
    durationEstimate: '35 sec / set'
  },
  {
    id: '69', name: 'Wrist Curl', category: 'Arms', difficulty: 'Beginner',
    equipment: 'Dumbbells', icon: '✊',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/forearms/cable-wrist-curl.gif',
    videoId: 'cOBaYeX3bYo',
    primaryMuscle: 'Forearm Flexors', secondaryMuscles: ['Wrist Extensors'],
    instructions: ['Sit with forearms on thighs', 'Dumbbell in hand palms up', 'Curl wrist upward', 'Squeeze forearm at peak', 'Lower with control'],
    durationEstimate: '30 sec / set'
  },
  {
    id: '70', name: 'Farmer Walk', category: 'Arms', difficulty: 'Beginner',
    equipment: 'Dumbbells', icon: '🌾',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/quads/farmers-walk.gif',
    videoId: '1uOs1hP3u4A',
    primaryMuscle: 'Forearms', secondaryMuscles: ['Traps', 'Core', 'Shoulders'],
    instructions: ['Pick up heavy dumbbells', 'Stand tall with shoulders back', 'Walk forward with controlled steps', 'Keep core braced', 'Walk for distance or time'],
    durationEstimate: '20-30 sec walk'
  },

  // ═══════════════════ CORE ═══════════════════
  {
    id: '71', name: 'Hanging Knee Raise', category: 'Core', difficulty: 'Intermediate',
    equipment: 'Pull-up Bar', icon: '🧘',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/assisted-hanging-knee-raise.gif',
    videoId: 'hdng3Nm1x_E',
    primaryMuscle: 'Rectus Abdominis', secondaryMuscles: ['Hip Flexors', 'Obliques'],
    instructions: ['Hang from bar, arms extended', 'Keep legs together', 'Raise knees toward chest', 'Avoid momentum or swinging', 'Lower legs with control'],
    durationEstimate: '50 sec / set'
  },
  {
    id: '72', name: 'Plank', category: 'Core', difficulty: 'Beginner',
    equipment: 'Bodyweight', icon: '📏',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/weighted-front-plank.gif',
    videoId: 'pSHjTRCQxIw',
    primaryMuscle: 'Rectus Abdominis', secondaryMuscles: ['Core', 'Shoulders', 'Glutes'],
    instructions: ['Forearms on ground, elbows under shoulders', 'Body in straight line from head to heels', 'Engage core and glutes', 'Hold position', 'Breathe steady throughout'],
    durationEstimate: '30-60 sec hold'
  },
  {
    id: '73', name: 'Crunch', category: 'Core', difficulty: 'Beginner',
    equipment: 'Bodyweight', icon: '🌀',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/weighted-crunch.gif',
    videoId: 'ZKw4t23ERuw',
    primaryMuscle: 'Rectus Abdominis', secondaryMuscles: ['Obliques'],
    instructions: ['Lie on back, knees bent, feet flat', 'Hands behind head lightly', 'Curl shoulders off ground', 'Squeeze abs at top', 'Lower controlled'],
    durationEstimate: '30 sec / set'
  },
  {
    id: '74', name: 'Leg Raise', category: 'Core', difficulty: 'Intermediate',
    equipment: 'Bodyweight', icon: '⬆️',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/seated-leg-raise.gif',
    videoId: 'r24ntO4IvKc',
    primaryMuscle: 'Lower Rectus Abdominis', secondaryMuscles: ['Hip Flexors'],
    instructions: ['Lie flat on back, legs extended', 'Hands under glutes or at sides', 'Raise legs to 90°', 'Lower slowly without touching floor', 'Keep lower back pressed down'],
    durationEstimate: '40 sec / set'
  },
  {
    id: '75', name: 'Russian Twist', category: 'Core', difficulty: 'Beginner',
    equipment: 'Bodyweight', icon: '🌀',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/weighted-russian-twist.gif',
    videoId: '_d5cpAre7_w',
    primaryMuscle: 'Obliques', secondaryMuscles: ['Rectus Abdominis', 'Hip Flexors'],
    instructions: ['Sit with knees bent, feet lifted', 'Lean back slightly', 'Rotate torso side to side', 'Touch floor beside hip each rep', 'Keep core engaged'],
    durationEstimate: '35 sec / set'
  },
  {
    id: '76', name: 'Bicycle Crunch', category: 'Core', difficulty: 'Beginner',
    equipment: 'Bodyweight', icon: '🚲',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/band-bicycle-crunch.gif',
    videoId: 'vV_sKNCpiVM',
    primaryMuscle: 'Obliques', secondaryMuscles: ['Rectus Abdominis', 'Hip Flexors'],
    instructions: ['Lie on back, hands behind head', 'Legs in tabletop position', 'Rotate bringing elbow to opposite knee', 'Extend other leg straight', 'Alternate sides in pedaling motion'],
    durationEstimate: '35 sec / set'
  },
  {
    id: '77', name: 'Cable Crunch', category: 'Core', difficulty: 'Intermediate',
    equipment: 'Cable', icon: '🪢',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/cable-tuck-reverse-crunch.gif',
    videoId: 'dkGwcfo9zto',
    primaryMuscle: 'Rectus Abdominis', secondaryMuscles: ['Obliques'],
    instructions: ['Kneel facing cable machine', 'Grip rope attached to high pulley', 'Pull rope down to forehead', 'Crunch forward curling torso', 'Squeeze abs, return controlled'],
    durationEstimate: '40 sec / set'
  },
  {
    id: '78', name: 'Ab Wheel Rollout', category: 'Core', difficulty: 'Advanced',
    equipment: 'Ab Wheel', icon: '⚙️',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/wheel-rollerout.gif',
    videoId: 'MinlHnG7j4k',
    primaryMuscle: 'Rectus Abdominis', secondaryMuscles: ['Lats', 'Shoulders', 'Core'],
    instructions: ['Kneel holding ab wheel', 'Roll wheel forward slowly', 'Keep core braced and back straight', 'Go as far as control allows', 'Pull back using abs'],
    durationEstimate: '45 sec / set'
  },
  {
    id: '79', name: 'Side Plank', category: 'Core', difficulty: 'Beginner',
    equipment: 'Bodyweight', icon: '📐',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/bodyweight-incline-side-plank.gif',
    videoId: 'sKMD_pbNm7w',
    primaryMuscle: 'Obliques', secondaryMuscles: ['Glutes', 'Shoulders', 'Core'],
    instructions: ['Lie on side, feet stacked', 'Elbow under shoulder', 'Lift hips forming straight line', 'Hold position', 'Switch sides'],
    durationEstimate: '30-45 sec hold'
  },
  {
    id: '80', name: 'V-Up', category: 'Core', difficulty: 'Advanced',
    equipment: 'Bodyweight', icon: '🔻',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/band-alternating-v-up.gif',
    videoId: 'iP2fjvG0g3w',
    primaryMuscle: 'Rectus Abdominis', secondaryMuscles: ['Hip Flexors', 'Obliques'],
    instructions: ['Lie flat with arms extended overhead', 'Simultaneously raise legs and torso', 'Touch feet at the top', 'Body forms V shape', 'Lower with control'],
    durationEstimate: '40 sec / set'
  },
  {
    id: '81', name: 'Pallof Press', category: 'Core', difficulty: 'Intermediate',
    equipment: 'Cable', icon: '🛡️',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/band-horizontal-pallof-press.gif',
    videoId: '5aZ0IhJS8O8',
    primaryMuscle: 'Obliques', secondaryMuscles: ['Core', 'Shoulders'],
    instructions: ['Stand sideways to cable machine', 'Grip handle at chest level', 'Press straight out from chest', 'Resist rotation from the cable', 'Slowly return to chest'],
    durationEstimate: '35 sec / set'
  },
  {
    id: '82', name: 'Mountain Climber', category: 'Core', difficulty: 'Beginner',
    equipment: 'Bodyweight', icon: '⛰️',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/mountain-climber.gif',
    videoId: 'fpmWW6iXfes',
    primaryMuscle: 'Rectus Abdominis', secondaryMuscles: ['Hip Flexors', 'Shoulders', 'Core'],
    instructions: ['Start in plank position', 'Drive one knee to chest', 'Quickly switch legs', 'Keep hips low and stable', 'Maintain pace throughout'],
    durationEstimate: '30 sec / set'
  },
  {
    id: '83', name: 'Dead Bug', category: 'Core', difficulty: 'Beginner',
    equipment: 'Bodyweight', icon: '🪲',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/dead-bug.gif',
    videoId: 'o4GKiEoYClI',
    primaryMuscle: 'Rectus Abdominis', secondaryMuscles: ['Core', 'Hip Flexors'],
    instructions: ['Lie on back, arms up, legs in tabletop', 'Simultaneously extend opposite arm and leg', 'Lower toward floor without touching', 'Return to start', 'Alternate sides'],
    durationEstimate: '35 sec / set'
  },
  {
    id: '84', name: 'Hanging Leg Raise', category: 'Core', difficulty: 'Advanced',
    equipment: 'Pull-up Bar', icon: '🦇',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/abs/hanging-leg-raise.gif',
    videoId: '2n4UqRIJyk4',
    primaryMuscle: 'Rectus Abdominis', secondaryMuscles: ['Hip Flexors', 'Obliques'],
    instructions: ['Hang from bar, full extension', 'Raise straight legs to 90°', 'Pause at top', 'Lower with slow control', 'Avoid swinging'],
    durationEstimate: '45 sec / set'
  },

  // ═══════════════════ ADDITIONAL COMPOUND ═══════════════════
  {
    id: '85', name: 'Clean and Press', category: 'Shoulders', difficulty: 'Advanced',
    equipment: 'Barbell', icon: '🏋️',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/quads/barbell-clean-and-press.gif',
    videoId: 'KCe8l86-alA',
    primaryMuscle: 'Deltoids', secondaryMuscles: ['Traps', 'Quads', 'Glutes', 'Core'],
    instructions: ['Bar on floor, overhand grip', 'Explosively pull bar to shoulders', 'Dip slightly then press overhead', 'Lock out', 'Lower to shoulders then floor'],
    durationEstimate: '50 sec / set'
  },
  {
    id: '86', name: 'Kettlebell Swing', category: 'Legs', difficulty: 'Intermediate',
    equipment: 'Kettlebell', icon: '🔔',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/kettlebell-swing.gif',
    videoId: 'bMQHAmCXJAI',
    primaryMuscle: 'Glutes', secondaryMuscles: ['Hamstrings', 'Core', 'Lower Back'],
    instructions: ['Feet wider than shoulders, kettlebell on floor', 'Hinge at hips, grab bell', 'Hike bell between legs', 'Thrust hips forward swinging bell to chest', 'Control descent'],
    durationEstimate: '40 sec / set'
  },
  {
    id: '87', name: 'Turkish Get-Up', category: 'Shoulders', difficulty: 'Advanced',
    equipment: 'Kettlebell', icon: '🧞',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/kettlebell-turkish-get-up-squat-style.gif',
    videoId: 'sgd8n917Zv0',
    primaryMuscle: 'Shoulders', secondaryMuscles: ['Core', 'Glutes', 'Full Body'],
    instructions: ['Lie down with kettlebell in one hand', 'Press bell up, keep arm locked', 'Roll to elbow, then hand', 'Stand up keeping bell overhead', 'Reverse motion to return'],
    durationEstimate: '60 sec / set'
  },
  {
    id: '88', name: 'Thruster', category: 'Legs', difficulty: 'Advanced',
    equipment: 'Barbell', icon: '🔥',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/kettlebell-thruster.gif',
    videoId: 'RqRX_PfMJ5A',
    primaryMuscle: 'Quadriceps', secondaryMuscles: ['Glutes', 'Shoulders', 'Core'],
    instructions: ['Bar at shoulders (front rack)', 'Squat to parallel', 'Explode up pressing bar overhead', 'Lock out arms at top', 'Lower bar to shoulders for next rep'],
    durationEstimate: '45 sec / set'
  },
  {
    id: '89', name: 'Burpee', category: 'Core', difficulty: 'Intermediate',
    equipment: 'Bodyweight', icon: '💥',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/dumbbell-burpee.gif',
    videoId: 'qLBImHhCXSw',
    primaryMuscle: 'Full Body', secondaryMuscles: ['Chest', 'Quads', 'Core', 'Shoulders'],
    instructions: ['Stand then squat down', 'Place hands on floor', 'Jump feet back to plank', 'Do a push-up', 'Jump feet forward and explode up'],
    durationEstimate: '30 sec / set'
  },
  {
    id: '90', name: 'Dumbbell Snatch', category: 'Shoulders', difficulty: 'Advanced',
    equipment: 'Dumbbells', icon: '⚡',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/dumbbell-one-arm-snatch.gif',
    videoId: 'xA_DpewzL7c',
    primaryMuscle: 'Deltoids', secondaryMuscles: ['Traps', 'Quads', 'Glutes', 'Core'],
    instructions: ['Dumbbell between feet, one hand grip', 'Hike bell back between legs', 'Explosively extend hips pulling bell up', 'Pull under the bell catching overhead', 'Stand tall with locked arm'],
    durationEstimate: '45 sec / set'
  },
  {
    id: '91', name: 'Bear Crawl', category: 'Core', difficulty: 'Intermediate',
    equipment: 'Bodyweight', icon: '🐻',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/cardio/bear-crawl.gif',
    videoId: 'LCVMqEmgglo',
    primaryMuscle: 'Core', secondaryMuscles: ['Shoulders', 'Quads', 'Glutes'],
    instructions: ['Start on hands and knees', 'Lift knees slightly off ground', 'Crawl forward with opposite hand and foot', 'Keep back flat and hips low', 'Maintain steady pace'],
    durationEstimate: '30 sec / set'
  },
  {
    id: '92', name: 'Pistol Squat', category: 'Legs', difficulty: 'Advanced',
    equipment: 'Bodyweight', icon: '🔫',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/kettlebell-pistol-squat.gif',
    videoId: 'bH3mRwnAN88',
    primaryMuscle: 'Quadriceps', secondaryMuscles: ['Glutes', 'Core', 'Calves'],
    instructions: ['Stand on one leg, other extended forward', 'Squat down on standing leg', 'Keep extended leg off floor', 'Descend to parallel or below', 'Drive up through heel'],
    durationEstimate: '50 sec / set'
  },
  {
    id: '93', name: 'Handstand Push-Up', category: 'Shoulders', difficulty: 'Advanced',
    equipment: 'Bodyweight', icon: '🙃',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/triceps/handstand-push-up.gif',
    videoId: 'gSjHRuRQ4hk',
    primaryMuscle: 'Deltoids', secondaryMuscles: ['Triceps', 'Upper Chest', 'Core'],
    instructions: ['Kick up into handstand against wall', 'Lower body by bending elbows', 'Head touches floor at bottom', 'Press back up to straight arms', 'Keep core braced throughout'],
    durationEstimate: '45 sec / set'
  },
  {
    id: '94', name: 'Muscle-Up', category: 'Back', difficulty: 'Advanced',
    equipment: 'Bodyweight', icon: '💫',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/lats/kipping-muscle-up.gif',
    videoId: 'syS5adRBy88',
    primaryMuscle: 'Latissimus Dorsi', secondaryMuscles: ['Triceps', 'Chest', 'Core'],
    instructions: ['Grip rings or bar', 'Pull explosively to chest', 'Turn wrists over at top', 'Press up into dip position', 'Lower controlled to hang'],
    durationEstimate: '40 sec / set'
  },
  {
    id: '95', name: 'Zercher Squat', category: 'Legs', difficulty: 'Advanced',
    equipment: 'Barbell', icon: '🔄',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/barbell-zercher-squat.gif',
    videoId: 'Da75bVCfTNo',
    primaryMuscle: 'Quadriceps', secondaryMuscles: ['Glutes', 'Core', 'Upper Back'],
    instructions: ['Bar resting in elbow crooks', 'Stand with feet shoulder-width', 'Squat down keeping torso upright', 'Descend to parallel', 'Drive up through heels'],
    durationEstimate: '45 sec / set'
  },
  {
    id: '96', name: 'Cossack Squat', category: 'Legs', difficulty: 'Intermediate',
    equipment: 'Bodyweight', icon: '💃',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/weighted-squat.gif',
    videoId: 'tpczTeSkHz0',
    primaryMuscle: 'Adductors', secondaryMuscles: ['Quadriceps', 'Glutes', 'Calves'],
    instructions: ['Stand with wide stance', 'Shift weight to one side', 'Squat down on that leg', 'Other leg straight extended', 'Push off to switch sides'],
    durationEstimate: '40 sec / set'
  },
  {
    id: '97', name: 'Single-Arm Dumbbell Push Press', category: 'Shoulders', difficulty: 'Intermediate',
    equipment: 'Dumbbells', icon: '💢',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/dumbbell-push-press.gif',
    videoId: 'hU9cNWJK9L8',
    primaryMuscle: 'Deltoids', secondaryMuscles: ['Triceps', 'Core', 'Quads'],
    instructions: ['Hold dumbbell at shoulder', 'Slight dip in knees', 'Explode up pressing dumbbell overhead', 'Lock out at top', 'Lower controlled'],
    durationEstimate: '40 sec / set'
  },
  {
    id: '98', name: 'TRX Row', category: 'Back', difficulty: 'Beginner',
    equipment: 'TRX', icon: '🪢',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/upper-back/suspended-row.gif',
    videoId: 'fW_jdwZT804',
    primaryMuscle: 'Middle Back', secondaryMuscles: ['Biceps', 'Rear Deltoids'],
    instructions: ['Grip TRX handles, lean back', 'Body straight from head to heels', 'Pull chest toward handles', 'Squeeze shoulder blades', 'Lower with control'],
    durationEstimate: '35 sec / set'
  },
  {
    id: '99', name: 'Medicine Ball Slam', category: 'Core', difficulty: 'Intermediate',
    equipment: 'Medicine Ball', icon: '💣',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/upper-back/medicine-ball-overhead-slam.gif',
    videoId: 'cgKqNn90MEo',
    primaryMuscle: 'Rectus Abdominis', secondaryMuscles: ['Shoulders', 'Core', 'Legs'],
    instructions: ['Hold medicine ball overhead', 'Slam ball down to floor hard', 'Squat to catch the bounce', 'Stand and raise ball overhead', 'Repeat explosively'],
    durationEstimate: '30 sec / set'
  },
  {
    id: '100', name: 'Resistance Band Pull-Apart', category: 'Chest', difficulty: 'Beginner',
    equipment: 'Resistance Bands', icon: '💫',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/delts/band-standing-rear-delt-row.gif',
    videoId: 'SuvO4TBwSu4',
    primaryMuscle: 'Rear Deltoids', secondaryMuscles: ['Rhomboids', 'Traps'],
    instructions: ['Hold band in front at shoulder height', 'Pull band apart stretching across chest', 'Squeeze shoulder blades', 'Return with control', 'Keep arms straight throughout'],
    durationEstimate: '30 sec / set'
  },
  {
    id: '101', name: 'Band Pull-Through', category: 'Legs', difficulty: 'Beginner',
    equipment: 'Resistance Bands', icon: '🔄',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/band-pull-through.gif',
    videoId: 'wGFw_9gr7rY',
    primaryMuscle: 'Glutes', secondaryMuscles: ['Hamstrings', 'Core'],
    instructions: ['Face away from anchor, band between legs', 'Hinge at hips pulling band through', 'Squeeze glutes at full hip extension', 'Return to start with control', 'Keep back flat throughout'],
    durationEstimate: '35 sec / set'
  },
  {
    id: '102', name: 'Dumbbell Pullover', category: 'Chest', difficulty: 'Intermediate',
    equipment: 'Dumbbells', icon: '🔄',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/dumbbell-straight-arm-pullover.gif',
    videoId: 'tpLnfSQJ0gg',
    primaryMuscle: 'Latissimus Dorsi', secondaryMuscles: ['Chest', 'Triceps', 'Core'],
    instructions: ['Lie across bench with upper back supported', 'Hold dumbbell overhead with both hands', 'Lower dumbbell behind head in arc', 'Feel stretch in lats and chest', 'Pull dumbbell back to start'],
    durationEstimate: '40 sec / set'
  },
  {
    id: '103', name: 'Sissy Squat', category: 'Legs', difficulty: 'Advanced',
    equipment: 'Bodyweight', icon: '🦩',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/quads/weighted-sissy-squat.gif',
    videoId: 'AYN-U5nZieY',
    primaryMuscle: 'Quadriceps', secondaryMuscles: ['Core', 'Calves'],
    instructions: ['Stand with feet together', 'Hold onto support if needed', 'Lean back while bending knees', 'Lower torso toward floor', 'Knees travel far forward'],
    durationEstimate: '40 sec / set'
  },
  {
    id: '104', name: 'Windshield Wiper', category: 'Core', difficulty: 'Advanced',
    equipment: 'Bodyweight', icon: '🌀',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/pectorals/isometric-wipers.gif',
    videoId: 'CZS3m8zBVSA',
    primaryMuscle: 'Obliques', secondaryMuscles: ['Rectus Abdominis', 'Core'],
    instructions: ['Lie on back, arms extended to sides', 'Raise legs to 90°', 'Rotate legs to one side keeping upper body flat', 'Rotate to the other side', 'Control movement throughout'],
    durationEstimate: '40 sec / set'
  },
  {
    id: '105', name: 'JM Press', category: 'Arms', difficulty: 'Advanced',
    equipment: 'Barbell', icon: '🔧',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/triceps/barbell-lying-close-grip-press.gif',
    videoId: 'T6hKsaGd0bU',
    primaryMuscle: 'Triceps Brachii', secondaryMuscles: ['Chest', 'Shoulders'],
    instructions: ['Lie on bench, grip bar close', 'Lower bar to upper chest/neck area', 'Elbows travel forward toward feet', 'Press bar back up to start', 'Triceps focused bench variation'],
    durationEstimate: '40 sec / set'
  },
  {
    id: '106', name: 'Spider Curl', category: 'Arms', difficulty: 'Intermediate',
    equipment: 'Dumbbells', icon: '🕷️',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/biceps/cable-curl.gif',
    videoId: 'CITtSuda0Fg',
    primaryMuscle: 'Biceps Brachii', secondaryMuscles: ['Forearms'],
    instructions: ['Lie face down on incline bench', 'Dumbbells hanging straight down', 'Curl weights toward shoulders', 'Squeeze biceps at peak', 'Lower with full control'],
    durationEstimate: '40 sec / set'
  },
  {
    id: '107', name: 'Bent-Over Two-Arm Dumbbell Row', category: 'Back', difficulty: 'Intermediate',
    equipment: 'Dumbbells', icon: '🏋️',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/upper-back/barbell-bent-over-row.gif',
    videoId: 'paCfxhgW6bI',
    primaryMuscle: 'Latissimus Dorsi', secondaryMuscles: ['Rhomboids', 'Rear Deltoids', 'Biceps'],
    instructions: ['Hinge at hips, dumbbells in each hand', 'Pull both dumbbells to lower ribcage', 'Squeeze back muscles at top', 'Lower under control', 'Keep back flat throughout'],
    durationEstimate: '40 sec / set'
  },
  {
    id: '108', name: 'Medicine Ball Rotational Throw', category: 'Core', difficulty: 'Advanced',
    equipment: 'Medicine Ball', icon: '🎯',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/triceps/medicine-ball-supine-chest-throw.gif',
    videoId: 'SZBWY0Dsu0A',
    primaryMuscle: 'Obliques', secondaryMuscles: ['Core', 'Shoulders', 'Legs'],
    instructions: ['Stand sideways to wall, ball at chest', 'Rotate torso away from wall', 'Explosively rotate and throw ball at wall', 'Catch on rebound', 'Repeat for reps'],
    durationEstimate: '35 sec / set'
  },
  {
    id: '109', name: 'Single-Leg Romanian Deadlift', category: 'Legs', difficulty: 'Intermediate',
    equipment: 'Dumbbells', icon: '🦩',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/glutes/dumbbell-romanian-deadlift.gif',
    videoId: 'CkrqLaDGvOA',
    primaryMuscle: 'Hamstrings', secondaryMuscles: ['Glutes', 'Core', 'Lower Back'],
    instructions: ['Hold dumbbells, stand on one leg', 'Hinge forward keeping standing leg slightly bent', 'Lift other leg straight back', 'Lower dumbbells toward floor', 'Squeeze hamstring and glute to return'],
    durationEstimate: '45 sec / set'
  },
  {
    id: '110', name: 'Cross-Body Dumbbell Curl', category: 'Arms', difficulty: 'Beginner',
    equipment: 'Dumbbells', icon: '✖️',
    imageUrl: 'https://cdn.jsdelivr.net/gh/JahelCuadrado/ExerciseGymGifsDB@v1.1.0/biceps/dumbbell-cross-body-hammer-curl.gif',
    videoId: 'qmQkt1Y-FX8',
    primaryMuscle: 'Brachioradialis', secondaryMuscles: ['Biceps Brachii', 'Forearms'],
    instructions: ['Stand holding dumbbells at sides', 'Curl one dumbbell across body toward opposite shoulder', 'Squeeze at the top', 'Lower and repeat on other side', 'Alternate each rep'],
    durationEstimate: '35 sec / set'
  },
];
