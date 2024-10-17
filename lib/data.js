const fs=require('fs');
const path=require('path');


const lib={};
lib.basedir=path.join(__dirname, '/../.data/');

lib.create=(dir,file,data,callback)=>{
    // open file for writing
    fs.open(`${lib.basedir+dir}/${file}.josn`,'wx',(err,fileDescription)=>{
        if(!err && fileDescription)
            {
                //convert data to String
                const stringData=JSON.stringify(data);

                // write data to file and then close it
                fs.writeFile(fileDescription,stringData,(err)=>{
                    console.log(fileDescription);
                    if(!err)
                        {
                            fs.close(fileDescription,(err)=>{
                                if(!err)
                                    {
                                        callback(false);
                                    }
                                    else{
                                        callback("Error closing the new file! ");
                                    }
                            })
                        }
                        else
                        {
                            callback('Error writing to new file')
                        }
                })
            }else{
                callback(err);
            }
           

    })

}
lib.read=(dir,file,callback)=>{
    fs.readFile(`${lib.basedir+dir}/${file}.josn`,'utf-8',(err,data)=>{
        callback(err,data);
    });
}
// update file 
lib.update=(dir,file,data,callback)=>{
    fs.open(`${lib.basedir+dir}/${file}.josn`,'r+',(err,fileDescriptor)=>{
            if(!err)
                {
                    // convert data to string
                    const stringData=JSON.stringify(data);
                    // truncating the file; 
                    fs.ftruncate(fileDescriptor,(err)=>{
                        if(!err)
                            {
                                fs.writeFile(fileDescriptor,stringData,(err)=>{
                                    if(!err)
                                        {
                                            fs.close(fileDescriptor,(err)=>{
                                                if(!err)
                                                    {
                                                        callback(false);
                                                    }
                                                    else
                                                    {
                                                        callback('Error file closing');
                                                    }
                                            })
                                        }
                                        else
                                        {
                                            callback("Error file writing")
                                        }
                                })
                            }
                            else {
                                callback('Error truncating file')
                            }
                    })
                }
                else{
                    callback("File is not updating")
                }
    })
    
}

// deleting file
lib.delete=(dir,file,callback)=>{
    // unlink file
    fs.unlink(`${lib.basedir+dir}/${file}.josn`,(err)=>{
        if(!err)
            {
                callback(false);
            }
            else
            {
                console.log("Delete Unsuccessful");
            }
    })

}

module.exports=lib;