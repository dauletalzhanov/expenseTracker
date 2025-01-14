const db = require("../services/db");

const getCategories = async () => {
  try {
    const rows = await db.query("SELECT * FROM Category");
    return rows;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

const createCategory = async (category) => {
  try {
    const result = await db.query(
      "INSERT INTO Category (CategoryName) VALUES (?)",
      [category]
    );
    return result;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

//Deleting a category
async function deleteCategory(id) {
  let sql = `DELETE FROM category WHERE CategoryID=?`;
  await db.pool.query(sql, [id]);
}

async function getSingleCategory(id) {
  let sql = `SELECT * FROM category WHERE CategoryID=?`;
  let category = await db.pool.query(sql, [id]);
  category = category[0][0];
  return category;
}

// 

// Update a category
async function updateCategory(categoryID, categoryName) {
  const query = "UPDATE Category SET CategoryName = ? WHERE CategoryID = ?";
  const values = [categoryName, categoryID];
  await db.query(query, values);
}

module.exports = {
  getCategories,
  getSingleCategory,
  createCategory,
  updateCategory,
  deleteCategory,
};

