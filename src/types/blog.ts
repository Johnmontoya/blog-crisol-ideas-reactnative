import { IUser } from "./auth";

export interface IBlogResponse {
    valid: string;
    results: number;
    blog: Iblogs;
}

export interface IBlogsResponse {
    valid: string;
    results: number;
    blogs: Iblogs[];
}

export interface IBlog {
    id: string;
}

export interface Iblogs {
    _id: string;
    author: IUser;
    title: string;
    subTitle: string;
    description: string;
    category: string;
    image: File;
    isPublished: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface IDashboard {
    blogs: number;
    comments: number;
    drafts: number;
    users: number;
    recentblogs: Iblogs[];
}

export interface IDashboardResponse {
    Blogs: IDashboard
}

export interface IResponse {
    message: string;
    valid: string;
    content: string;
}