import config from "../config/config";
import { Client, ID, Databases, Storage, Query } from "appwrite";

export class Service{
    client = new Client();
    databases;
    bucket;
    constructor(){
        this.client
            .setEndpoint(config.appwriteUrl)
            .setProject(config.appwriteProjectId)
        this.databases = new Databases(this.client);
        this.bucket = new Storage(this.client);
    }

    async createPost({title, slug, content, coverImage, status, userId, tags, views}){
        try{
            return await this.databases.createDocument(
                config.appwriteCollectionId,
                config.appwriteDatabaseId,
                slug,
                {
                    title,
                    content,
                    coverImage,
                    status,
                    userId,
                    publishedDate: new Date().toISOString(),
                    tags,
                    views  
                },
            );
        }catch(error){
            console.log("Appwrite service :: createPost :: error", error);
        }
    }

    async updatePost(slug, {title, content, coverImage, status, tags, views}){
        try{
            return await this.databases.updateDocument(
                config.appwriteCollectionId,
                config.appwriteDatabaseId,
                slug,
                {
                    title,
                    content,
                    coverImage,
                    status,
                    tags,
                    views  
                },
            );
        }catch(error){
            console.log("Appwrite service :: updatePost :: error", error);
        }
    }

    async getPost(slug){
        try{
            return await this.databases.getDocument(
                config.appwriteCollectionId,
                config.appwriteDatabaseId,
                slug,
            );
        }catch(error){
            console.log("Appwrite service :: getPost :: error", error);
        }
    }

    async getPosts(queries = [Query.equal("status", "published")]){
        try{
            return await this.databases.listDocuments(
                config.appwriteCollectionId,
                config.appwriteDatabaseId,
                queries,
            );
        }catch(error){
            console.log("Appwrite service :: getPosts :: error", error);
        }
    }

    async deletePost(slug){
        try{
            await this.databases.deleteDocument(
                config.appwriteCollectionId,
                config.appwriteDatabaseId,
                slug,
            );
            return true;
        }catch(error){
            console.log("Appwrite service :: deletePost :: error", error);
            return false;
        }
    }

    async uploadFile(file){
        try{
            return await this.bucket.createFile(
                config.appwriteBucketId,
                ID.unique(),
                file
            );
        }catch(error){
            console.log("Appwrite service :: uploadFile :: error", error);
        }
    }

    async deleteFile(fileId){
        try{
            await this.bucket.deleteFile(
                config.appwriteBucketId,
                fileId
            );
            return true;
        }catch(error){
            console.log("Appwrite service :: deleteFile :: error", error);
            return false;
        }
    }

    getFilePreview(fileId){
        return this.bucket.getFileView(
            config.appwriteBucketId,
            fileId
        );
    }
}

const service = new Service();
export default service;