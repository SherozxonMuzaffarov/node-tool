const Product = require('../../models/product');
const myCache = require('../../utils/nodeCache')
const upload = require('../../utils/uploadFile')
const path = require('path');
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);


module.exports = {
    getAll: async (req, res) => {
        try {
            const user = myCache.get('userData');
            let model;
    
            model = await Product.find({});
            // if (user.role === 'Admin') {
            // } else {
            //     model = await Product.where('depo_id').equals(user.depo_id);
            // }
    
            // Map over each product and add image data
            const productsWithImages = await Promise.all(model.map(async (product) => {
                const createdAtDate = new Date(product.createdAt);
                const expirationDate = new Date(createdAtDate);
                expirationDate.setDate(expirationDate.getDate() + 8);

                const currentDate = new Date();
                const differenceInDays = Math.floor((expirationDate - currentDate) / (1000 * 60 * 60 * 24));

                product.daysRemaining = differenceInDays;
                
                if(product.receiver_image) {
                    // Assuming 'receiver_image' contains the image filename
                    const imagePath = path.join(__dirname, '..', 'uploads', product.receiver_image);
    
                    // Check if the image file exists
                    if (fs.existsSync(imagePath)) {
                        // Read the image file and convert it to base64
                        const imageBuffer = await readFile(imagePath);
                        const base64Image = imageBuffer.toString('base64');
        
                        // Add the base64 representation of the image to the product
                        product.receiver_image = base64Image;
                    } 
        
                    return product;
                }
                return product
            }));
            
    
            res.json(productsWithImages);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    getOne: async (req, res) => {
        try {
            let model = await Product.findById( req.params.id );
            if (!model) {
                res.status(404).json({ message: `${req.params.id} id record not found` });
            }
            res.send(model);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },

    create: async (req, res) => {
        try {
            const { name, quantity, receiver_name } = req.body;
            const product = await Product.create({
                name,
                quantity,
                receiver_name,
                is_returned: false,
              })
            res.json(product);
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
          }
    },

// PUT /api/products/:id
    update: [upload.single('image'), async (req, res) => {
        
        try {
            
            // Update the product with the received ID
            const productId = req.params.id;
            const updatedProduct = await Product.findByIdAndUpdate(
                productId,
                { receiver_image: req.file.filename },
                { new: true }
            );

            // Check if the product was found and updated
            if (!updatedProduct) {
                return res.status(404).json({ error: 'Product not found' });
            }

            res.json( updatedProduct );
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }],

// PUT /api/products/:id
    giveBack: async (req, res) => {
        const productId = req.params.id;
        try {
            // Update the product with the received ID
            const updatedProduct = await Product.findByIdAndUpdate(
                productId,
                { is_returned: true, returned_date:  new Date()},
                { new: true }
            );

            // Check if the product was found and updated
            if (!updatedProduct) {
                return res.status(404).json({ error: 'Product not found' });
            }

            res.json( updatedProduct );
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    delete: async (req, res) => {
        try {
            const { id } = req.params;
            const deletedModel = await Product.findOneAndDelete({ _id: id });

            if (!deletedModel) {
                return res.status(404).json({ message: 'Product not found' });
            }

            res.json({ message: 'Product deleted successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    },
};
