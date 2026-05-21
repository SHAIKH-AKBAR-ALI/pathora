from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    supabase_url: str = ""
    supabase_anon_key: str = ""
    supabase_service_role_key: str = ""

    openai_api_key: str = ""
    groq_api_key: str = ""
    gemini_api_key: str = ""

    stripe_secret_key: str = ""
    stripe_webhook_secret: str = ""

    upstash_redis_url: str = ""
    upstash_redis_token: str = ""

    aws_access_key_id: str = ""
    aws_secret_access_key: str = ""
    aws_s3_bucket_name: str = ""
    aws_region: str = ""

    database_url: str = ""


settings = Settings()
