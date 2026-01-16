// Local mapping for project details (Challenge/Solution) associated with project names
// This allows us to add "Enterprise" storytelling without backend schema changes immediately.

export const PROJECT_DETAILS = {
    // Example entries - key must match exact project name in Supabase
    "Villa Particulier – Breda": {
        challenge: "Ernstige vervuiling door jarenlange algengroei en weersinvloeden op de witte gevel.",
        solution: "Zachte reiniging met stoomtechniek en nabehandeling met hydrofobeermiddel voor langdurige bescherming."
    },
    // Fallback for any project not explicitly listed
    "DEFAULT": {
        challenge: "Vervuiling, groene aanslag en weersinvloeden hebben het oppervlak aangetast.",
        solution: "Specialistische dieptereiniging met gepaste druk en temperatuur, gevolgd door een beschermende coating."
    }
};

export const CATEGORIES = [
    { id: 'all', label: 'Alles' },
    { id: 'Oprit', label: 'Oprit & Terras' },
    { id: 'Gevel', label: 'Gevel' },
    { id: 'Tuin', label: 'Onkruid' },
    { id: 'Bedrijf', label: 'Bedrijfsterrein' }
];

export const getProjectDetails = (projectName) => {
    return PROJECT_DETAILS[projectName] || PROJECT_DETAILS["DEFAULT"];
};
