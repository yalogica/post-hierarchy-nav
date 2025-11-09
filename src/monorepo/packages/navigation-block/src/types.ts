export interface BlockProps {
    postType: string;
    mode: 'all' | 'custom' | 'auto';
    customPostId: number;
    showCount: boolean;
    activePostClassName: string;
    [key: string]: any; 
}