import {renderHook, act} from '@testing-library/react-native';
import CDebounce from '../../../components/common/CDebounce';

jest.useFakeTimers();

describe('CDebounce', () => {
  it('should return initial value immediately', () => {
    const {result} = renderHook(() => CDebounce('hello', 500));
    expect(result.current).toBe('hello');
  });

  it('should update value after delay', () => {
    const {result, rerender} = renderHook(
      ({value, delay}) => CDebounce(value, delay),
      {initialProps: {value: 'hello', delay: 500}},
    );

    rerender({value: 'world', delay: 500});
    expect(result.current).toBe('hello');

    // Fast-forward time
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe('world');
  });
});
