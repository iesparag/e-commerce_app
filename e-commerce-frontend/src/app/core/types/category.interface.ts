export interface Category {
    _id: string;
    name: string;
    description: string;
    subCategories: string[]; 
    categoryImage: string;
    categoryImageimageUrl: string;
  }

  export interface ISubCategory {
    _id: string;                   
    name: string;                  
    description?: string;          
    categoryId: string;            
    createdBy: string;             
    subCategoryImage?: string;     
    subCategoryImageUrl?: string;  
    createdAt: string;             
    updatedAt: string;             
}