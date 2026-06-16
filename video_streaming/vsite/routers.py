class VideoRouter:
    def db_for_read(self, model, **hints):
        if model._meta.app_label == 'api':
            return 'video_db'
        return 'default'

    def db_for_write(self, model, **hints):
        if model._meta.app_label == 'api':
            return 'video_db'

        return 'default'

    def allow_migrate(self, db, app_label, **hints):
        if app_label == 'api':
            return db == 'video_db'  # api only in video_db
        if db == 'video_db':
            return False  # nothing else in video_db
        return True  # everything else in default