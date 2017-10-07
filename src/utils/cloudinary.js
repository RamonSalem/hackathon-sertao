const cloudinary = require('cloudinary');

cloudinary.config({ 
  cloud_name: 'dlputo9gp', 
  api_key: '459619384388838', 
  api_secret: 'VvXKtV3H4OidXZj-o3FGx_B1dCE' 
});

exports.destroyImage = (imageLink)=>{
    return new Promise((resolve, reject)=>{
        const publicId = splitLink(imageLink);
        if(!publicId)
            reject({status: 'Link needed to return the image public_id', code: 400});
        else{
            cloudinary.uploader.destroy(publicId, (result)=>{ 
                resolve(result);
            });
        }
    });
}

exports.destroyImages = (imageLinks)=>{

    return new Promise((resolve, reject)=>{
        if(!imageLinks.length)
            reject({data: 'Links needed to return the image public_id', code: 400});
        else{
            let i = 0;
            imageLinks.forEach(link=>{
                cloudinary.uploader.destroy(link, (result)=>{ 
                        console.log(result);
                });
                i++;
                if (i == imageLinks.length) {
                    resolve({data : 'Images removed', code : 200});
                }   
            });
        }
    });
}

/*

splitLink = (link)=>{
    // link have the pattern: 'http://res.cloudinary.com/art-project/image/upload/v1488904845/qrlcblgncnp04zqxxg5e.jpg';
    //We need to get the publicId
    if (link) {
        let split1 = link.split('/');
        let split2 = split1[split1.length-1].split('.');
        return split2[0];    
    }else{
        console.log('Link needed to return the image public_id');
        return link;
    }
}*/