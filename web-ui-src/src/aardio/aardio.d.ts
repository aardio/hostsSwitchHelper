/// <reference types="aardio" />

declare namespace aardio {
  
    interface External {  
        /** 返回系统HOSTS文本 */
        loadSystemHostText(): Promise<string>; 
        /** 刷新DNS，刷新Chrome DNS缓存 */
        clearDnsCache(token:string):Promise<boolean>;
        /** 创建HOST配置 */
        getAllSections():Promise<Array<{name:string;status:string;hosts:string}>>;
        /** 创建HOST配置 */
        createSection(name:string):Promise<string>;
        /** 创建HOST配置 */
        delSection(name:string):Promise<string>;
        /** 创建HOST配置 */
        updateSection(oldName:string,newName:string,status:boolean,data:string):Promise<boolean>;
    }
}

   