$(document).ready(function () {
    // Show message function
    function showMessage(container, message, type = "error") {
        $(container).html(`<div class="message ${type}">${message}</div>`);
        setTimeout(() => {
            $(container).empty();
        }, 5000);
    }

    // Clear form errors
    function clearErrors() {
        $(".form-group").removeClass("error");
    }

    // Show form errors
    function showError(fieldName, message) {
        const field = $(`input[name="${fieldName}"]`);
        const formGroup = field.closest(".form-group");
        formGroup.addClass("error");
        formGroup.find(".error-message").text(message);
    }

    // Login form submission
    $("#login-form").submit(function (e) {
        e.preventDefault();
        clearErrors();

        const username = $("#username").val().trim();
        const password = $("#password").val();

        if (!username) {
            showError("username", "Please enter your Username");
            return;
        }

        if (!password) {
            showError("password", "Please enter your password");
            return;
        }

        const $button = $("#login-btn");
        $button.prop("disabled", true);
        $button.html('<span class="loading"></span>Logging in...');

        $.ajax({
            url: API_CONFIG.AUTH_API.BASE_URL + API_CONFIG.AUTH_API.LOGIN_ENDPOINT,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            data: JSON.stringify({ username, password }),
            success: function (response) {
                if (response.success) {
                    // Store authentication data
                    localStorage.setItem("authToken", response.token);
                    localStorage.setItem("loggedInID", response.user.officeCode + response.user.deptCode);
                    localStorage.setItem("loggedInNIK", response.user.id);
                    localStorage.setItem("loggedInUser", response.user.username);

                    if (response.user.groupName !== "SUPPORT") {
                        showMessage("#message-container", `User ${response.user.username} tidak diberikan akses, silakan hubungi admin.`);
                    } else {
                        showMessage("#message-container", "Login successful! Redirecting...", "success");

                        // Redirect to main page
                        setTimeout(() => {
                            window.location.href = "index.html";
                        }, 1500);
                    }
                } else {
                    showMessage("#message-container", "Login failed. Please try again.");
                }
            },
            error: function (xhr) {
                let errorMessage = "Login failed. Please try again.";
                if (xhr.responseJSON && xhr.responseJSON.message) {
                    errorMessage = xhr.responseJSON.message;
                }
                showMessage("#message-container", errorMessage);
            },
            complete: function () {
                $button.prop("disabled", false);
                $button.html("Login");
            },
        });
    });

    // Input formatting - convert to uppercase
    $('input[type="text"]').on("input", function () {
        this.value = this.value.toUpperCase();
    });
});
