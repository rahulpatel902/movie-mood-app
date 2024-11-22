export const API_KEY = 'a699e481031e762bab78f5b6f496c8d5';
export const BASE_URL = 'https://api.themoviedb.org/3';
export const IMG_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export const moodCategories = {
    '💫 Positive/Upbeat': {
        happy: { label: '😊 Happy (Feel-good comedies)', genres: [35, 10751] },
        excited: { label: '🤩 Excited (Action-packed thrillers)', genres: [28, 12] },
        optimistic: { label: '⭐ Optimistic (Motivational dramas)', genres: [18, 10751] },
        grateful: { label: '🥰 Grateful (Family & relationships)', genres: [10749, 18] },
        relaxed: { label: '😌 Relaxed (Slice-of-life films)', genres: [35, 18] },
        cheerful: { label: '😄 Cheerful (Colorful animations)', genres: [16, 35] },
        playful: { label: '🤪 Playful (Fantasy comedies)', genres: [14, 35] }
    },
    '🤔 Reflective': {
        nostalgic: { label: '🌅 Nostalgic (Childhood classics)', genres: [10751, 18] },
        thoughtful: { label: '💭 Thoughtful (Philosophical dramas)', genres: [18, 99] },
        contemplative: { label: '🧠 Contemplative (Art house films)', genres: [18, 878] },
        spiritual: { label: '✨ Spiritual (Faith & belief)', genres: [99, 18] }
    },
    '🔥 Intense/Exciting': {
        adventurous: { label: '🚀 Adventurous (Epic journeys)', genres: [12, 878] },
        romantic: { label: '❤️ Romantic (Love stories)', genres: [10749, 35] },
        mysterious: { label: '🔍 Mysterious (Noir thrillers)', genres: [9648, 53] },
        inspired: { label: '✨ Inspired (Success stories)', genres: [18, 36] },
        empowered: { label: '💪 Empowered (Underdog triumphs)', genres: [18, 28] },
        brave: { label: '🦁 Brave (Survival stories)', genres: [28, 12] }
    },
    '😌 Calm/Soothing': {
        relaxing: { label: '🌿 Relaxing (Meditative films)', genres: [99, 18] },
        dreamy: { label: '🌙 Dreamy (Magical realism)', genres: [14, 10751] },
        peaceful: { label: '🌊 Peaceful (Nature documentaries)', genres: [99, 10751] },
        meditative: { label: '🧘 Meditative (Slow cinema)', genres: [18, 99] }
    },
    '💜 Melancholic/Emotional': {
        sad: { label: '😢 Sad (Emotional dramas)', genres: [18, 10749] },
        lonely: { label: '🌧️ Lonely (Self-discovery)', genres: [18, 10751] },
        heartbroken: { label: '💔 Heartbroken (Loss & grief)', genres: [18, 10749] },
        yearning: { label: '🌠 Yearning (Bittersweet stories)', genres: [18, 10749] }
    },
    '🖤 Dark/Edgy': {
        angry: { label: '😤 Angry (Revenge thrillers)', genres: [53, 28] },
        rebellious: { label: '😈 Rebellious (Anti-hero stories)', genres: [28, 80] },
        fearless: { label: '👻 Fearless (Horror thrillers)', genres: [27, 53] },
        eerie: { label: '🌘 Eerie (Paranormal tales)', genres: [27, 14] },
        dark: { label: '🦇 Dark (Psychological thrillers)', genres: [53, 9648] }
    },
    '👩‍🚀 Explorative': {
        neutral: { label: '😐 Neutral (Balanced dramas)', genres: [18, 35] },
        curious: { label: '🔬 Curious (Science & discovery)', genres: [99, 878] },
        analytical: { label: '🧐 Analytical (Investigation)', genres: [9648, 99] },
        educational: { label: '📚 Educational (Historical)', genres: [36, 99] },
        observant: { label: '👀 Observant (Character studies)', genres: [18, 36] }
    },
    '👥 Social': {
        sociable: { label: '🎉 Sociable (Party movies)', genres: [35, 10751] },
        teamSpirit: { label: '🤝 Team Spirit (Sports & heists)', genres: [28, 12] },
        celebratory: { label: '🎊 Celebratory (Festival films)', genres: [35, 10402] },
        cultural: { label: '🌍 Cultural (International films)', genres: [18, 99] }
    },
    '🌺 Seasonal': {
        festive: { label: '🎄 Festive (Holiday classics)', genres: [10751, 35] },
        autumnal: { label: '🍁 Autumnal (Cozy dramas)', genres: [18, 10751] },
        wintery: { label: '❄️ Wintery (Snow adventures)', genres: [12, 10751] },
        summery: { label: '☀️ Summery (Beach & road trips)', genres: [35, 12] }
    },
    '🎲 Unique': {
        quirky: { label: '🎪 Quirky (Indie comedies)', genres: [35, 18] },
        whimsical: { label: '🦄 Whimsical (Fairy tales)', genres: [14, 10751] },
        epic: { label: '⚔️ Epic (Historical sagas)', genres: [28, 36] },
        cult: { label: '🌟 Cult (Fan favorites)', genres: [878, 35] },
        mindBlown: { label: '🤯 Mind-Blown (Plot twisters)', genres: [9648, 878] },
        weird: { label: '🎨 Weird (Experimental)', genres: [18, 14] }
    }
};