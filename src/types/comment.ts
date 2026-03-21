// Interfaz actualizada según la estructura real de datos
export interface IBlogInfo {
    _id: string;
    title: string; // Cambiado de 'title' a 'titulo' según tus datos
}

export interface ICommentState {
    id: string;
}

// Interfaz actualizada según la estructura real de tus datos
export interface IComment {
    _id: string;
    blog: IBlogInfo; // Referencia al blog (ej: "blog_data[0]")
    name: string;
    content: string;
    isApproved: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

export interface ICommentResponse {
    valid: string;
    message: string;
    comments: IComment[];
}

export interface ICommentAdd {
    blog: string;
    name: string;
    content: string;
}