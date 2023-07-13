
class InputError(Exception):
    """Exception raised for input-related errors."""

    def __init__(self, message):
        self.message = message
        super().__init__(self.message)


class InternalError(Exception):
    """Exception raised for internal errors."""

    def __init__(self, message):
        self.message = message
        super().__init__(self.message)
