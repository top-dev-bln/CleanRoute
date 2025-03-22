import React from 'react'
import { CircleAlertIcon } from "lucide-react"
function Profile() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Public profile</h1>

        <div className="space-y-8 bg-white p-6 rounded-lg shadow-sm">
          {/* Profile Picture */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="flex-shrink-0">
              <div className="h-24 w-24 rounded-full bg-gray-200 overflow-hidden">
                <img src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhIQEhAQEBISEhAQDxAQDw8NDxAPFRUWFhURFRUYHSggGBolHRUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGi0dHR0tKystLi0tLS0tLTAtLS0rKystKy0rNi0tLS0wKystLS0tLSstLSstLS0tKzUtLS0rLf/AABEIAOAA4AMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAAEBQIDBgEAB//EADwQAAEDAwIDBgMGBAUFAAAAAAEAAgMEESESMQVBURMiYXGBkQYyoRRScrHB4UJigtEjM0OywhUWU/Dx/8QAGgEAAgMBAQAAAAAAAAAAAAAAAQIAAwQFBv/EACcRAAICAgIBBAICAwAAAAAAAAABAhEDIQQSMRNBUXEFMiJhFCMz/9oADAMBAAIRAxEAPwD5lRSKdTlRpoLKNULKj3Gb0cDQq3hRDivFMKcurI3qhwKlA03RCkGB6sZIqdChdLQaC+0VD5UIZVwvR6ihrZVIFC06YNjwg0FI8xyujkyqdJUIKhrnFo3bg+Ntz73CHUjGLignnKvkfhAlxugkNovKvpjhC3V0JwjQUz1ccIIIisOEMxMkB+T0iqYFbIq490RfcseMLlJuvS7LlDkqRCx/T3smMBcEPwtmRdPnwCyYIkrpe6ViKod8+a2vF4bArHSjvFRisaxFSlgug6aVG9oqmCtFBpFW6nRhkXmBTYLF7oVOmhyj3RhSjYAg2FSKTAqnUpTIELtglTGcxGaI3UxQFOWsCmSAj3ZXYpgoSCmDYwAp6wq3lDs2FNnHMCTQ0rmaZ7EAnU78Lz+6dXwb9FsB8Oh9Dt3uwbjnfQE8XRZGN2Ywxod0WUfRjVGx3MtF/O2VXO0BAAHUchbZrR9Af1VtM24VUx7x87e2P0RNKcIyGigauZhCNTCvOECjFgl5K5iqYXZVsqhC3KYVeQh4wvcPZlWEYUqHdCIzNDQttZPwO6s/TP2Wghd3VYgCbjB7pWGlPeK3HGPlKxEw7xQYC6kaiHuVkUSi9ipu2O1o8x6ua5UtYrGtRK2WalF0qrfJZUmRSgBImVwmQTRlEtiwgx1E8apQdOSh5GZXQFKQKDIDdHxwakJw+PUQtVQ0OFnz5o40XYsfYzdbSd3T98tZ6OcGn6FfXA0Nhvbu9mfoFguI0w1xj7pY4m18l7SB7MefRb+tna2kkY8aXd0AkcnYvfyTQy9sXb7L446lR8ooYiA9v3ZJB6F1x+aHrhpNzsASfQXsnVTLEx7O+AZe6Rf/AFG7H1H5BLOON70TfvyNB/CN0YZO0l/ZVkx9bXwJWMOlpO5Fz5k3v9UVAMJrxOhtDSyt2dEI3/yysw4fmgoISQrpMqS2BVaGATaqozZL3RkboRkn4FmmgaQLlOMq6QKEG6d+AR8hDxhRot1ZLsqKLdSA8jT8OjuVoHABvos/wx1iE5muQrEKKOL/AClYqT5j5rb8SbdtlmHcOJJKTJJR8hSbCg1UPRenCW1L7KiDseS0EB4Vck4QTpSqXOJVqiUtF0sqhG7KpRFI25TeEFIPhGyNBwowxXsjGUZIVEppeS5RYlqH5VWtGVvDn3wFUygd0RU4V5EcWH8IkyFsKWrAAWSoaUjkmUhcAsfJwxy+5fim4of0vEoS6pjcQ2S1HJGSNV2doWEe7ne6d/GVM50cYbYuc+zww6rsaLucbbWNhblchfHPid5vG4kg95uCQdJH5f3R/DPi+ekDWMcXaxqeXHtL6gMC/iPyWrHgrEoh9dKWyjjNBIKk32YwGMHa552UPtbnae1c67Q4Ne21xcWva2SnXDHOqTLO65vZrSTcnTkn3KRVgs4rZjgkkvgyZJXJv5G3CZ2CH7OZnPHa9ozW3Ta7bFu55/mU6ooWHF87WIIN/VYSok0jG/unXBK9rmNYZHPk6OFiB0v6KnPgjPVtN/A+OcvOtGqfSg4SXiVJa+EwoOIt1Nikd33m0ePmHn1/uruKU91x7nhzdJM1OpwtGMljVEO6dVFJZLmxWcusppox1TOybKug3RTo8Kuijymgxpj2iOyes+VKKKLZNRtZXIUEli1FdjoQrWGysL1x/wAnKSao1cZKmZMSCyBlg1LlOSUzhiWv9EV/sKXUfguR0afdiCr4KJD1aWwdDOS0Srp4CHLUz0mEAKYAowy2iOFM7SsOE5ogOaqpYRhHspuix5siejRCL8nRA13JTFC3oF1sZCi+UhYpRfsy7XuXRUTeihV07QCTbAvfouNrEi+LOJkR9mDmTB/AN/fA91MOLLPKo35FnKMYtmS4zUCWRzx8t9LB/KOf6peJ2XGprzpwAHAAi5O9r8/3Rv2bU5rBvuT0CXTxWDT1F/rZemSS0vY5l2abgnHDqDbNa3ZrQMNHRO66hicC4gDGq4usXwZl3gdSAt9xanDYWAG+qIPPgOQSOaTS+R1BtN/BjnkMN7Gzr98ZGnp1B8ivMfG1jXseTIy2XN0l1j9VfGJHFrQAWj5hixClX8LN+63u+CerEv2G/ZNeY3306XskBabObY5t4EXC1jg2QXaQ4dR+vRYXh8MrQLtJbyuLo9okaC9t2kDBaS1Y+Zxlnp31aL8EnC0laHtbRCyzVRSnXsjqPj0pIa9hkbsXNAD2nxGx+iZilD+8M+FrH2WNLLx1/Pa+V4LX1yPXkUQ0OEIYdLvVa+GlASLikXev4o8XlOeSiZcdRsKohgJjGl1NJhOYILtBXXMgDKqta7UusSOiAmqbLk/kouUkka+O6TE9NGjWhUxsRDQrpSESOxuRsUoS9ysYqpq0NF0HPkuhXx5XmuVzSqovqO9llLdOKcYS2nCZwPFljz5LZfjjRGZ1kuqHFNJGXQU8SrhMkgCJhJWYkf8Aaanfug2HgxvP1z7rR8WqezhkcMHTpb+J2Afqs78ONAEjiQMAG/TcrtcCNpzf0jFyH4iMXU7GuAbgvDiSfut/dIuLcOIi1AfK5xx/43Hf0OPVc/6pqqtWzdLo2jlYA/qjOH8UF9D8scSM9Dgj6reZzO0k5aQRyIK2ddxB/ZxvZkkNAByNIFiElrfh031ROBG+l2PqnXw7Wshsyqic4AEsLRdurk09L9VTml1XZK2i7DHs+rdJh8FB2rWva7szjW0gj2Tg8LY1oLci33r2PQhWcHr6eV5LAWWGotO4HNhB/wDcp1CyKS5jcz+lwI8iAuXLkZmzqR4+JGIdWWdi99iBz9EwfJdliNLiMDa/pyV/GuAP1CaMNNiHOaCM+V0IT94G/TUQcAn5XbbdfVWRyd1/YJQ6PXgUwTCIyk7lt4xa93dB47HyvzsqP+4ZS9jYoHgucGsc+4dI/oG9PFUfEb+lvEkgfsmnwfwxwH2uSR8kjgWRlzibR4F85Jx7LZPP6WG5fRgljUsmjWyHHjbNuqzPE5M+qfSOwszX/N6rlfjo/wCwtzv+IbRi5WioPlAWWo3kELSUj7NXoUYQLikfePikXEI7BOaybU5K+J7Lmcz/AKRNGH9WUxsXrK2M4XCqlIeimyvYFCysDlJMiRxEwxoTtEVBOFTkutDxoLYyysbIQoMlBXHOWBpt7Lwpsy8cqqEIjSpVE8mZ+LWjQxl8vcXW6hoz9XBI6SFwjlGwLHZ8bXCL+M6k/aImjeNt/wCpxvb2DfdGyQjsiQLXaceYXo+GqwRv3ObmdzZgS7N1eyVUFdiObLSVmx4TUOe0XvbY26jmmVd8PSEXj7wcLgEhvoknBKoNGkC5OPIlbXjnFjTUwc0Xdpa1v4lk5TkqUfLNfFUbbl4RgaueppZOyfGC97Cxuk6i5jsAY3IIVbKwMIIbLTSX+Ua23N+Qsbp58P8ACZBM+oqCHSWaWZ1aS4XPkQLD1WquD6bLLPmLE+qV/I7xuW7+jIM+KK2D/MjkczYOcxzAfO+xVFd8TVM4Ijifi2ohpktfbDR+a3Lo2uaWuaHNIsWuAII6EKVHTMjGmNjY272Y0NF+uFm/z4LfTY/Sb12dGB4Z8Kz1BElQXxs30u/zHDwGzfz8F9Apog1rWNADWgNaByAFgFa9Va7LLn5M8/nwvYaGNQPTDBWXrj3vVaGqnFisxUvu/wBVs/GxfeyrkPQfQC5HgnofghLuEsFlfO+zl3TEQcMoHiOytqZ0PL3guby1/NM0Yv1AxMuiVCG6kwJOo1hzX3VlkG02V8MirkhkQmYVCJ5vZHEAqtsWUvfWw9QmncbK7dRibhXRgLHKSsuSLIAQi3SWBJ2AJPkFBtkn4jxVjJIw4uMd3tm0ZOi1zbqRYpuNj9bKk1r3Bkl0jfuY98hmndI7d77+Q5D0AATqonLmljeY03HLySupp2xSXveMnVHI3LCw/KQem/sehTamexp+YdRsvS0kqXscvd7MfW0TozYgjp4hC81vK1scrS02ODY3yPELExRXkDf5tP1QCOuDvDAHHcuvbwHNMeLcQkmLHHETLnzsM/29UoJ7xHIEgeSJ4hMexYwbvdbxLRy90HBPYyk1o1PD5SYWyH5njWfXYe1gp09QSV0wFrGN+61rfYL1LTm9156dNyZvV6GLCSjIGnmqInBHROCwyLkcezCW1RITcoOeG6kHvZJITvJIKRzN7y1M9PZpWYqD311/x0k5OjJyFSGvDXEYR04BF0DRO26oma67RjF9ScrrJML1U1VMYVz+Yto0YfAHpUwbKntFXJKq0rHCXPUmFL+0KtilUljpEUhox6KibzS6GRMI5MLHltF0dlr5bKplQgayYhdpHXS+lUbZO26CuK1jgxrWmxkOm4/hba7j58vVI6x1tsafl8DvtzHgqeMcWtUNjHyx4d4uNr+w/VGytD26hm/9l2ODiUMS+XsxZ5dpfQrpq2xZDp7g1kMLmnLzdzW33GPlP1K9V8La+7oHWI+aIkgtPhfIHgf2QtXEMgqmllcxwdcm2B3i1wHg7+91paaYsZJqmCvlkaSw6mnmDcFX8MitI17tr3TeGqEz2tkjbI2xuHDs3Hyc35T4tt5KVRBBh0WtjMDS4dpZ/PvXBttyQv5I4/B6BkYN3kcz/wDVCgj7eqjA+RjgfCwN1yogiDSXucTa7XW0sOflaL/U322V/wANVjGS202uO4ejiMe4v7pMsmoNrdIaMNq9G+MIK8YQEDHxAdVf9qBXmH2R0tFMzSNlyKpIVjpAVWLFC7WwDKGbC72yFbgKt7lVVj2E1coLSslOLyJ3WOOkpC0d66634qO2zLynoYUIIKauGEopZeXij2yXx0XcRhBKo96yIjhFroSoPeumDHYXM572jVgWjF9uvGW6FcVIFaFFFdhrCuOksh2vUXuS9dhsPgnTandcLN078p7Syiyy8iNFuNl80N0O1xaUxjcCl/GpmxRuebdGjq47BZYScn1LZKlZkeNOBnkI6j30i6K4DxItPZuPdOM8ilGokkk3JNyepUm7rvQXWKXwc9u3Y94lEQSlrd08pyJotJ+Zox1IS91IQdlZ5FPUsBdgJkOGP7jA52XNa0hxPfcbc8DJVXCRpeL+Ss4fKddREe9pcXNBvkarkeCDCil0YmjiA3Y+RmxAMZEZYd8kEyZ6EdEPPDome0YtpI9AMo+nYI29o86QDgC538eZx9ApVTdX+Lb5mBo65zf2URCH2twz1yjabiHUpaR3W+X6lRaCubkwxto0xm6s0jKm43XG1diltLJhWPNysforwXdxt9twuR1mUC1mFABUvDHwN2Y1qpwWpVG4EldkcbWVEe66XAxdEzPnlYxp4sjzR8oGfJVQswFXJJghdIzAhOUW16H6FVCaxXP5kLaZpwukZ3s1IMUrrgKdNi0cEai+JWxlXkBByaYaF2ggo+mlK72N1Y2KySc1JBjGgqOoIWZ47xAzPsD3GXDfE83I/jNVoZpG78eTeZ/RIoGXPkCU/GwJPuLlm/1KwF0rhXVtKBtwiqLSCFpmgPb8oCxtC+xWt4fJeLV0woQoihs7yKGrYXsqTIAdDgA4jba1yiO27yLqZO5fVpPI4siwCfiTXdk9rtrtLT/UP0XJ6/UGjoB7qyoLnREYsN7Zbbq08vJK6dhLreKJBxSOvoaf4u0t5jTj8/ZFTQgJZxa8bobf6YDvW9yE4qDcXGxFx5Fc7lQfdNe5pxNdaAY5bFERy5Q8cSJjiylcUMgmSawUI5V2aFcZDhVPGmPbJTSYXeHWN1VNFhe4c0rdx1SM+V7G+rYBVTjIVtPFkqRZdaCoXuB2VEgsUwc3vWVVTDkLLn8l+NaEMcBU+wTRlKbbKD4T0QIL2QK7skWyErroT0QasNg8catMKuijVHGqnsoXO520t/Ecfv6JPTtjdtGQ4tPqldY4b3R6b/W6s4PYudf7jktKN4Q+0rQdnXafVbkqVGZuwS6ndcnj0uLehIUQUQDDh0BebBamhZpY5m+MJD8Ous781paOAkPcOmErdBSsQmTvFdqw4i3JTkoH6ibFNKOj1DIyE3qR+Q9JfAFw2mOh4OAR6XQ9DHaZoOM2KacW1xx91pxvjl4pRSF0jg/yQc0lbIoNukT46/U7GUx4A7tGdmfmjsPNh2/UeiJpODNOTnzXKKn7KqaBs9rwfbUP9qzPNDIqRf6M8e2GDh+VZFR5TNxVQKppjFD6ZcfTYV5euPkQ6sNoX1UYDVVw0bo6pgLhgKmCnLRstOJ0inJtjGBov6LsTAQfNCmUj2U6SQ2Ct7ITqQnjs9SEN1GW5JPiuxVCqyqx8boMjpgMWVruHtKKe5pXA8LNsfqLXUYC8aYImVyrc8IqwdQf7MFivjmo77IR/CNbvM4H0v7rZVlUI2Oe42a0ElfLeI1bpZHyu3cb26DkPZX4ou7EnoHK602II3GQuFcWkqD+IuDwyQbuFn/iH7IEFW6u7bxBVShBzwI5K+g8NiAgv1O+F804TLZ1uq+kUs94mj13WHltrSN3ES8sg9gXKRrQd/qhOIVoas47jLtW+L3WLHhnkdo2ZM0IKhz8d19ohG3GrfP8KScBqw1tjyQPGq0yG5QEUll1HiTx9TmLLWTsfSeGVocLBVRt11bAP4WSu9MN/wCSznwvUkygX5Faj4TeH1VS77jGMH9TiT/tCyQw+nJmnJm7wHH2cqDoU3dGCoGEJnIz7EroSpwQ3KdNowV6KhyopAIwUzbZVVVStthHSwHkq/s55qdhkhK+mvsrm0RA2TuKnaFOUNsp3DRmZYsWQXZZWgqabVsg5aWyfvYOoI2YqZlQrHBWkDkjQxaHXUCLKvUQkvxJxgxN0tP+I8Y/kbzd/ZRRt0BulYr+LeJdo7sGHusN5D95/wB3yH5+Syj22KNhdn191PiFLYagtSVKjM3bsWry8vJgEgVxeBXnBQhdTOsQVveGVIMY6W67rAQ7p5JWFkVhzsB0tZU5sfdFuLJ0ZHjlfdxAKXQxEqi5cepJTEyhhA3IAGP0TQgoqhZzcnYNXwFth1Q8sdsIt0vaSt6AgnyCu4m1rhqbywR5lWCFXAajRKD4OHqQtb8B3tUS83yBt+ukE/8ANYunhNwT94AfqvovwtTaaaPx1PPjqcT+VlTm0vsshs00IJGFLS4LtBJZNmhpWMtBYAUayJWwwhce6yAThjQNU8jYI3tgoPe0okoTPe5cDyUVWyNS8VQ2UohOaq0hKKquN00dpKGlogcplRLP/9k=" alt="" className="h-full w-full object-cover" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Profile picture</h3>
              <p className="text-sm text-gray-500">
                Your profile picture may be used by other integrated services and applications.
              </p>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-sm font-medium bg-gray-900 text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2">
                  Upload a photo
                </button>
                <button className="px-3 py-1.5 text-sm font-medium border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                  Remove
                </button> 
              </div>
              <div className="mt-4">
                <label htmlFor="picture-caption" className="block text-sm font-medium text-gray-700">
                  Picture caption
                </label>
                <input
                  id="picture-caption"
                  type="text"
                  placeholder="Add a caption for your picture"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Name */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                id="name"
                type="text"
                defaultValue="Jane Doe"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-sm text-gray-500">
                Your name may be used by other integrated services and applications.
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="username"
                  type="text"
                  defaultValue="janedoe"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button className="px-3 py-2 text-sm whitespace-nowrap border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2">
                  Change username
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                id="bio"
                placeholder="Add a bio"
                defaultValue="Product designer, photography enthusiast, and coffee lover. Always exploring new places and ideas."
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-24"
              />
              <p className="text-sm text-gray-500">You can @mention other users and organizations to link to them.</p>
            </div>

            <div className="space-y-2">
              <label htmlFor="pronouns" className="block text-sm font-medium text-gray-700">
                Pronouns
              </label>
              <input
                id="pronouns"
                type="text"
                placeholder="Add your pronouns"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-sm text-gray-500">This will be shown on your profile.</p>
            </div>
          </div>

          <hr className="border-gray-200" />

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Contact information</h3>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                defaultValue="jane.doe@example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="flex items-center gap-2 mt-1">
                <CircleAlertIcon className="h-4 w-4 text-gray-500" />
                <p className="text-sm text-gray-500">Your email is private. Learn about your email settings.</p>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                Website
              </label>
              <input
                id="website"
                type="url"
                placeholder="https://example.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                id="location"
                type="text"
                placeholder="San Francisco, CA"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="p-4 bg-gray-50 border border-gray-200 rounded-md">
            <p className="text-sm text-gray-600">
              All of the fields on this page are optional and can be deleted at any time, and by filling them out,
              you're giving us consent to share this data wherever your user profile appears.
            </p>
          </div>

          <div className="flex justify-end">
            <button className="px-4 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
              Update profile
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile