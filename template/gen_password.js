
const reset_password =  (name, email, token) => {
    return `<div>
                <main>
                    <div>
                        <h1>Hello, ${name}, your email id is ${email} </h1>
                        <h3>Token to reset your password.. </h3>
                        <p>
                            <strong>
                                    ${token}
                            </strong>
                        </p>

                        <p>If you didn't ask to reset your password, ignore this link.</p>

                        <h3>Thanks,</h3>
                        <h4>Team API.</h4>
                    </div>
                </main>
            </div>`
}

module.exports = reset_password