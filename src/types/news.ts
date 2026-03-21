export interface INewsResponse {
    valid: String;
    news: INewsData[];
}

export interface INewsData {
    _id: string;
    type: string;
    category: string;
    title: string;
    contentHero?: IContentHero; // Opcional
    contentQuote?: IQuote;
    contentBullet?: IBullet;
    isPublished: boolean;
    createdAt: string;
}

export interface IContentHero {
    imageUrl: string;
    description: string;
}

export interface IQuote {
    quoteText: string;
    context: string;
}

export interface IBullet {
    points: string;
    author: string;
}

export interface INews {
    id: string;
}