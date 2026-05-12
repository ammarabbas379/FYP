import profanity from 'leo-profanity';

// Initialize with default list
profanity.loadDictionary();

export interface FilterResult {
    isFriendly: boolean;
    reason?: string;
}

/**
 * Checks if the story subject is friendly and appropriate for kids.
 * 1. Checks for profanity using leo-profanity
 * 2. Checks for common "unfriendly" keywords not in standard profanity lists
 * 3. (Optional) Could be extended with an AI check
 */
export function checkStorySubject(subject: string): FilterResult {
    // 1. Basic Profanity Check
    if (profanity.check(subject)) {
        return {
            isFriendly: false,
            reason: "The subject contains inappropriate language. Please keep it friendly for kids!"
        };
    }

    // 2. Kid-Friendly Context Check (Custom keywords)
    const unfriendlyKeywords = [
        'kill', 'murder', 'blood', 'death', 'dead', 'sexy', 'naked', 'porn', 
        'horror', 'suicide', 'drug', 'alcohol', 'beer', 'wine', 'tobacco',
        'violent', 'weapon', 'gun', 'knife', 'stab', 'fight', 'hate', 'racist'
    ];

    const lowerSubject = subject.toLowerCase();
    for (const word of unfriendlyKeywords) {
        if (lowerSubject.includes(word)) {
            return {
                isFriendly: false,
                reason: `The word "${word}" might not be friendly for kids. Please choose a more magical and positive subject!`
            };
        }
    }

    return { isFriendly: true };
}
