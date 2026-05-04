class Github{
    constructor() {
        this.token = '28274fe73dbb39a173be91fb8f6b84f7a741cd40'
        this.repos_count = 5
        this.repos_sort = 'created_asc'
    }

    getHeaders(useAuth = true) {
        const headers = {
            Accept: 'application/vnd.github+json'
        }

        if (useAuth && this.token) {
            headers.Authorization = `token ${this.token}`
        }

        return headers
    }

    async fetchProfile(user, useAuth = true) {
        const response = await fetch(`https://api.github.com/users/${user}`, {
            headers: this.getHeaders(useAuth)
        })
        const profile = await response.json()
        return { response, profile }
    }

    async fetchRepos(user, useAuth = true) {
        const response = await fetch(`https://api.github.com/users/${user}/repos?per_page=${this.repos_count}&sort=${this.repos_sort}`, {
            headers: this.getHeaders(useAuth)
        })
        const repos = await response.json()
        return { response, repos }
    }

    async getUser(user) {
        try {
            let { response: profileResponse, profile } = await this.fetchProfile(user)

            if (!profileResponse.ok && profile.message === 'Bad credentials' && this.token) {
                // Invalid token: retry without authentication.
                const result = await this.fetchProfile(user, false)
                profileResponse = result.response
                profile = result.profile
            }

            if (!profileResponse.ok) {
                return {
                    profile,
                    repos: [],
                    error: profile.message || `GitHub API error: ${profileResponse.status}`
                }
            }

            const { response: repoResponse, repos } = await this.fetchRepos(user, profileResponse.ok && profile.message !== 'Bad credentials')

            return {
                profile,
                repos: Array.isArray(repos) ? repos : [],
                error: null
            }
        } catch (err) {
            return {
                profile: null,
                repos: [],
                error: err.message || 'Network error'
            }
        }
    }
    
}

export default Github;