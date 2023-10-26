/**
 * Account Settings - Account
 */

'use strict';

document.addEventListener('DOMContentLoaded', function ( e ) {
    (function () {
        const id = document.getElementById('id').value;

        const deactivateAcc = document.querySelector('#formAccountDeactivation');
        const btnSave = document.querySelector('.btn-save');
        // Update/reset user image of account page
        let accountUserImage = document.getElementById('uploadedAvatar');
        let firstName = document.getElementById("firstName");
        let lastName = document.getElementById("lastName");
        let fullName = document.getElementById("fullname");

        const fileInput = document.querySelector('.account-file-input'),
            resetFileInput = document.querySelector('.account-image-reset');

        if (accountUserImage) {
            const resetImage = accountUserImage.src;
            fileInput.onchange = async () => {
                if (fileInput.files[0]) {
                    accountUserImage.src = window.URL.createObjectURL(fileInput.files[0]);
                }

                const formData = new FormData();
                formData.append('avatar', fileInput.files[0]);
                formData.append('id', id);
                await fetch('/members/update', {
                    method: "PUT",
                    body: formData
                }).then(res => res.json())
                    .then(() => {
                        console.log("avatar updated")
                    })
            };
            resetFileInput.onclick = () => {
                fileInput.value = '';
                accountUserImage.src = resetImage;
            };
        }

        firstName.addEventListener('change', () => {
            fullName.value = firstName.value + " " + lastName.value;
        })

        lastName.addEventListener('change', () => {
            fullName.value = firstName.value + " " + lastName.value;
        });

        btnSave.addEventListener('click', async function ( e ) {
            e.preventDefault();
            try {
                await fetch(`/members`, {
                    method: "PUT",
                    body: JSON.stringify({
                        id: id,
                        name: fullName.value,
                        firstName: firstName.value,
                        lastName: lastName.value,
                        phone: document.getElementById("phoneNumber").value,
                        address: document.getElementById("address").value,
                        avatar: fileInput.files[0]
                    }),
                    headers: {
                        "Content-Type": "application/json",
                    }
                }).then(res => {
                    console.log(res)
                    if (res.status === 200) {
                        return res.json();
                    }
                }).then(res => {
                    if (res.status === 200) {
                        location.reload();
                    }
                }).catch(err => {
                    console.log(err)
                })
            } catch (e) {
                console.log(e)
            }
        });
    })();
});
