import { apiRequest } from "../../api/apiRequest";

export const registerUser = (user, photoFile) => {
    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("password", user.password);
    formData.append("password_confirm", user.password_confirm);
    if (photoFile) formData.append("photoFile", photoFile);

    return apiRequest("/users/register", {
        method: "POST",
        body: formData,
    });
};

export const updateUser = (id, user, photoFile) => {
    const formData = new FormData();
    formData.append("name", user.name);
    formData.append("email", user.email);
    formData.append("password", user.password);
    formData.append("password_confirm", user.password_confirm);
    if (photoFile) formData.append("photoFile", photoFile);

    return apiRequest(`/users/update/${id}`, {
        method: "PUT",
        body: formData,
    });
};

export const getMe = () => {
    const token = localStorage.getItem("token");

    return apiRequest("/users/me", {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};