export interface HttpAdapter {
    get<T>(url: string): Promise<T>//Manda de tipo generico
}