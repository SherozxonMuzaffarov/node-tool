const Product = require('../../models/product');
const myCache = require('../../utils/nodeCache')
const upload = require('../../utils/uploadFile')
const path = require('path');

module.exports = {
    getAll: async (req, res) => {
        try {
            const user = myCache.get('userData')
            if (user.role == 'Admin') {
                let model = await Product.find({});
                res.send(model);
            } else {
                let model = await Product.where('depo_id').equals(user.depo_id);
                res.send(model);
            }
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
            console.log(req.body);
            const { name, quantity, receiver_name } = req.body;
            const product = new Product({
              name,
              quantity,
              receiver_name,
              is_returned: false,
            });
            await product.save();
            res.json(product);
          } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
          }
    },

// PUT /api/products/:id
    update: [upload.single('image'), async (req, res) => {
        
        try {
            // At this point, the file has been saved to the 'src/upload' folder
  console.log('File saved:', req.file);


            

        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }],

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
