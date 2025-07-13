export interface RequestBody {
    title: string
    description: string
    images: string[]
    price: number
}

export interface CreateProductDTO {
    title: string
    price: number
    description?: string
    images?: string[]
    endTime: string // ✅ string because it's coming from JSON
}
