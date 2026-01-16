import { supabase } from './supabase';

export const fetchProjects = async () => {
    try {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('is_featured', { ascending: false })   // Featured projects first
            .order('created_at', { ascending: false });   // Then by date

        if (error) {
            console.error('❌ Error fetching projects:', error);
            return [];
        }

        if (!data || data.length === 0) {
            return [];
        }

        // Transform database projects to match the expected format
        const transformed = data
            .filter(project => project.before_image_url && project.after_image_url)
            .map((project) => ({
                id: project.id,
                projectName: project.name,
                before: project.before_image_url,
                after: project.after_image_url,
                category: project.category || 'Project',
                date: project.date,
                // New fields directly from DB - preferring Dutch columns if they exist
                challenge: project['Uitdaging'] || project.challenge,
                solution: project['Oplossing'] || project.solution,
                is_featured: project.is_featured
            }));

        return transformed;
    } catch (error) {
        console.error('❌ Exception in fetchProjects:', error);
        return [];
    }
};
