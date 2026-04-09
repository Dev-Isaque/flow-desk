import { apiRequest } from "../../api/apiRequest";

export async function getMe() {
    return apiRequest("/users/me", {
        method: "GET",
    });
}

export async function registerUser(userData, photoFile) {
    const formData = new FormData();

    formData.append("name", userData.name);
    formData.append("email", userData.email);
    formData.append("password", userData.password);
    formData.append("password_confirm", userData.password_confirm);

    if (photoFile) {
        formData.append("photoFile", photoFile);
    }

    return apiRequest("/users/register", {
        method: "POST",
        body: formData,
    });
}

export async function updateUser(id, userData, photoFile) {
    const formData = new FormData();

    if (userData.name?.trim()) {
        formData.append("name", userData.name.trim());
    }

    if (userData.email?.trim()) {
        formData.append("email", userData.email.trim());
    }

    if (userData.currentPassword) {
        formData.append("currentPassword", userData.currentPassword);
    }

    if (userData.password) {
        formData.append("password", userData.password);
    }

    if (userData.password_confirm) {
        formData.append("password_confirm", userData.password_confirm);
    }

    if (photoFile) {
        formData.append("photoFile", photoFile);
    }

    // Log para debug
    console.log("Enviando FormData:");
    for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
    }

    return apiRequest(`/users/update/${id}`, {
        method: "PATCH",
        body: formData,
    });
}
