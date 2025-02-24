import PropTypes from "prop-types";

const Sidebar = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-4">
      <h2 className="text-lg font-semibold mb-4">Categories</h2>
      <ul>
        {categories.map((category) => (
          <li
            key={category}
            className={`cursor-pointer p-2 rounded-md ${
              selectedCategory === category ? "bg-blue-500" : "hover:bg-gray-700"
            }`}
            onClick={() => onSelectCategory(category)}
          >
            {category}
          </li>
        ))}
      </ul>
    </div>
  );
};

Sidebar.propTypes = {
  categories: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedCategory: PropTypes.string.isRequired,
  onSelectCategory: PropTypes.func.isRequired,
};

export default Sidebar;