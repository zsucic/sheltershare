import uvicorn

if __name__ == '__main__':
    uvicorn.run("shshproj.asgi:application", reload=True, host="0.0.0.0", port=8000)