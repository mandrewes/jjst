package tech.rsqn.utils.jjst.aggregater;

import tech.rsqn.utils.jjst.aggregater.es6.ModuleScanner;
import tech.rsqn.utils.jjst.aggregater.es6.module.Module;
import tech.rsqn.utils.jjst.util.FileUtil;
import tech.rsqn.utils.jjst.util.ResourceUtil;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Collection;
import java.util.Map;
import java.util.Objects;

/**
 * @author Andy Chau on 7/9/20.
 */
public class JsCompileAggregater implements Aggregater {

    static final String TYPE = "javascript";

    /**
     * With ES6 aggregater will scan all files in the given directory and preprocess all content.
     *
     * @param buffer
     * @param cwd
     * @param jsFilePath
     * @param profiles
     * @throws IOException
     */
    @Override
    public void aggregateFromFile(final StringBuffer buffer,
                                  final File cwd,
                                  final String jsFilePath,
                                  final Collection<String> profiles) throws IOException {
        Objects.requireNonNull(buffer, "Parameter buffer is required");
        Objects.requireNonNull(cwd, "Parameter cwd is required");
        Objects.requireNonNull(jsFilePath, "Parameter jsFilePath is required");

        final Path fullPath = Paths.get(cwd.getPath(), jsFilePath);
        final ModuleScanner scanner = new ModuleScanner(fullPath.toString());

        this.buildOutput(buffer, scanner);
    }

    @Override
    public String getType() {
        return TYPE;
    }

    private StringBuffer buildOutput(final StringBuffer buffer, final ModuleScanner scanner) throws IOException {
        final Map<String, Module> scan = scanner.scan();

        this.addModuleRegistry(buffer);

        return buffer;
    }

    /**
     * Method to add the {@code module.registry.js} at the beginning of buffer.
     * @param buffer
     * @return
     */
    private StringBuffer addModuleRegistry(final StringBuffer buffer) throws IOException {
        final String resourcePath = ResourceUtil.getResource(Paths.get("/",
                "aggregate", "ES6", "module.registry.js").toString());

        buffer.append(FileUtil.getFileContents(new File(resourcePath)));
        return buffer;
    }
}
