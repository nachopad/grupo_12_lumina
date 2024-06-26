module.exports = (sequelize, dataType)=>{
    let alias = "Orders";

    let cols = {
        id : {
            type: dataType.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        sending_cost:{
            type: dataType.DECIMAL
        },
        sending_address:{
            type: dataType.STRING,
            allowNull: false
        },
        locality:{
            type: dataType.STRING,
            allowNull: false
        },
        postal_code:{
            type: dataType.STRING,
            allowNull: false
        },
        user_id: {
            type: dataType.INTEGER,
            allowNull: false
        },
        installment_id: {
            type: dataType.INTEGER,
            allowNull: false
        }, 
        total:{
            type: dataType.DECIMAL,
            allowNull: false
        }
    };

    let config = {
        tableName: "orders",
        timestamps: false
    };

    const Order = sequelize.define(alias, cols, config);

    Order.associate = function(models){
        Order.belongsTo(models.Users,{
            as: "users",
            foreignKey: "user_id"
        });
        Order.belongsTo(models.Installments, {
            as: 'installments',
            foreignKey: 'installment_id'
        });
        Order.belongsToMany(models.Products,{
            as: "products",
            through: models.ProductDetails,
            foreignKey: 'order_id',
            otherKey: 'product_id',
            timestamps: false
        });
    }
    return Order;
}