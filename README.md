# WebDiet Backend Project

## **Summary**
This project focuses on developing the backend of a diet planning web application. The goal is to demonstrate my skills in **C#**, **ASP.NET Core**, and **Entity Framework** while building a scalable and efficient **REST API**. The API provides comprehensive functionalities to manage users, meals, ingredients, and allergens. 

Please keep in mind this is a very alpha state of the API. I still working on it in my free time. Creating a frontend is also new to me, so it just has basic functionality for now.

### **Key highlights**:
- Designing a robust backend architecture using **ASP.NET Core**.
- Implementing a **relational database** structure with **Entity Framework**.
- Building secure, well-documented APIs that adhere to RESTful principles.
- Exploring and learning **frontend development** using **React** with a basic interface.

## **My Contributions**

### **Backend Development**
1. **Database Design**:
   - Built a relational database model with classes like `User`, `Menu`, `Dish`, `Ingredient`, and `Allergen`.
   - Established complex relationships, including:
     - Users having multiple menus for specific dates.
     - Each user might have his own version of the dish.
     - Many-to-many relationships between allergens, ingredients, dishes, menus and users.

2. **API Implementation**:
   - Created endpoints for CRUD operations on all entities (Users, Menus, Dishes, etc.).
   - Secured the API with validation rules and error handling to ensure data integrity.

3. **Advanced Features**:
   - Implemented logic for generating diet plans and calculating nutritional values for meals.
   - Supported filtering and searching for ingredients by allergens or nutritional content.

4. **Documentation and Testing**:
   - Used **Swagger/OpenAPI** to generate interactive documentation.
   - Wrote unit tests to ensure the reliability and stability of the backend.

### **Frontend Work-in-Progress**
- Basic components built in **React** to display data fetched from the API.
- Utilized **Vite** for a lightweight and fast development server.
- Focused on understanding React state management and component lifecycle.

## **Challenges and Solutions**

### **Database Design**:
- Managed complex relationships effectively using **Entity Framework** to minimize data redundancy.

### **Frontend Development**:
- As a beginner in React, tackled challenges in state management and component communication by studying documentation and tutorials.

### **API Optimization**:
- Optimized database queries to improve the performance of endpoints dealing with large datasets.

## **Skills Demonstrated**
- **Backend Development**: ASP.NET Core, Entity Framework, RESTful APIs.
- **Database Management**: Relational modeling, LINQ, migrations.
- **Frontend Exploration**: React basics, component rendering.
- **DevOps**: Using tools like Swagger for API documentation and testing.

## **Impact**
The WebDiet backend lays a strong foundation for building a feature-rich diet planning app. It showcases my ability to handle complex backend requirements while continuously learning and experimenting with frontend technologies.

## **How This Relates to My Career Goals**
This project aligns with my career aspirations to specialize in **backend development** while gradually building proficiency in **full-stack development**. It highlights my backend expertise and my commitment to learning new technologies, including React, to expand my skill set.
