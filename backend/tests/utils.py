class AnyInt:
    def __eq__(self, other):
        return isinstance(other, int)


class AnyNumber:
    def __eq__(self, other):
        return isinstance(other, float) or isinstance(other, int)
