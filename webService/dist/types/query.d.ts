export interface ExecuteQueryParams {
    dataSourceId: string;
    sql: string;
    params?: any[];
}
export interface SaveQueryParams {
    name: string;
    dataSourceId: string;
    sql: string;
    description?: string;
    tags?: string[];
    folderId?: string;
}
export interface UpdateQueryParams {
    name?: string;
    sql?: string;
    description?: string;
    tags?: string[];
    folderId?: string | null;
}
export interface CreateFolderParams {
    name: string;
    description?: string;
    parentId?: string;
}
export interface UpdateFolderParams {
    name?: string;
    description?: string;
    parentId?: string | null;
}
export interface QueryResult {
    type: 'select' | 'update';
    columns?: Array<{
        name: string;
        type: number | string;
        dataType: string;
        table?: string;
        schema?: string;
    }>;
    rows?: any[];
    rowCount?: number;
    affectedRows?: number;
    insertId?: number | string | null;
    changedRows?: number;
}
